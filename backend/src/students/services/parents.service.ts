import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Parent } from '../entities/parent.entity';
import { Student } from '../entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { CreateParentDto } from '../dto/parent/create-parent.dto';
import { UpdateParentDto } from '../dto/parent/update-parent.dto';
import { ParentFilterDto } from '../dto/parent/parent-filter.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createParentDto: CreateParentDto, userId?: string): Promise<Parent> {
    // Check if parent with same email already exists
    const existingParent = await this.parentsRepository.findOne({
      where: { email: createParentDto.email },
      withDeleted: true,
    });

    if (existingParent) {
      throw new ConflictException(`Parent with email ${createParentDto.email} already exists`);
    }

    // Create new parent
    const parent = this.parentsRepository.create({
      ...createParentDto,
      createdBy: userId,
    });

    // Handle user account creation if requested
    if (createParentDto.createUserAccount && !createParentDto.userId) {
      // Logic to create user account would go here
      // This would typically involve calling a user service
    }

    // Save parent first to get ID
    const savedParent = await this.parentsRepository.save(parent);

    // Associate students if provided
    if (createParentDto.studentIds && createParentDto.studentIds.length > 0) {
      const students = await this.studentsRepository.findBy({
        id: In(createParentDto.studentIds),
      });

      if (students.length > 0) {
        savedParent.students = students;
        await this.parentsRepository.save(savedParent);
      }
    }

    return this.findOne(savedParent.id);
  }

  async findAll(filterDto: ParentFilterDto): Promise<[Parent[], number]> {
    const { 
      name, 
      email, 
      phoneNumber, 
      relationship, 
      studentId,
      city,
      country,
      occupation,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filterDto;

    const query = this.parentsRepository.createQueryBuilder('parent');

    // Apply filters
    if (name) {
      query.andWhere(
        '(parent.firstName LIKE :name OR parent.lastName LIKE :name)',
        { name: `%${name}%` }
      );
    }

    if (email) {
      query.andWhere('parent.email LIKE :email', { email: `%${email}%` });
    }

    if (phoneNumber) {
      query.andWhere(
        '(parent.phoneNumber LIKE :phoneNumber OR parent.alternativePhoneNumber LIKE :phoneNumber)',
        { phoneNumber: `%${phoneNumber}%` }
      );
    }

    if (relationship) {
      query.andWhere('parent.relationship = :relationship', { relationship });
    }

    if (studentId) {
      query.innerJoin('parent.students', 'student', 'student.id = :studentId', { studentId });
    }

    if (city) {
      query.andWhere('parent.city LIKE :city', { city: `%${city}%` });
    }

    if (country) {
      query.andWhere('parent.country LIKE :country', { country: `%${country}%` });
    }

    if (occupation) {
      query.andWhere('parent.occupation LIKE :occupation', { occupation: `%${occupation}%` });
    }

    // Add relations
    query.leftJoinAndSelect('parent.user', 'user')
      .leftJoinAndSelect('parent.students', 'students');

    // Add pagination
    query.skip((page - 1) * limit)
      .take(limit)
      .orderBy(`parent.${sortBy}`, sortOrder);

    // Execute query
    const [parents, total] = await query.getManyAndCount();
    return [parents, total];
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentsRepository.findOne({
      where: { id },
      relations: ['user', 'students'],
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }

    return parent;
  }

  async findByEmail(email: string): Promise<Parent> {
    const parent = await this.parentsRepository.findOne({
      where: { email },
      relations: ['user', 'students'],
    });

    if (!parent) {
      throw new NotFoundException(`Parent with email ${email} not found`);
    }

    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto, userId?: string): Promise<Parent> {
    const parent = await this.findOne(id);

    // Update parent
    Object.assign(parent, {
      ...updateParentDto,
      updatedBy: userId,
    });

    // Handle student associations
    if (updateParentDto.studentIds && updateParentDto.studentIds.length > 0) {
      const students = await this.studentsRepository.findBy({
        id: In(updateParentDto.studentIds),
      });

      if (students.length > 0) {
        parent.students = students;
      }
    }

    return this.parentsRepository.save(parent);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const parent = await this.findOne(id);

    // Soft delete
    parent.deletedBy = userId;
    await this.parentsRepository.save(parent);
    await this.parentsRepository.softDelete(id);
  }

  async restore(id: string): Promise<Parent> {
    // Check if parent exists in deleted records
    const parent = await this.parentsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }

    if (!parent.deletedAt) {
      throw new BadRequestException(`Parent with ID ${id} is not deleted`);
    }

    // Restore parent
    await this.parentsRepository.restore(id);
    return this.findOne(id);
  }

  async getParentsByStudent(studentId: string): Promise<Parent[]> {
    const query = this.parentsRepository.createQueryBuilder('parent')
      .innerJoin('parent.students', 'student', 'student.id = :studentId', { studentId })
      .leftJoinAndSelect('parent.user', 'user');

    return query.getMany();
  }

  async addStudentToParent(parentId: string, studentId: string): Promise<Parent> {
    const parent = await this.findOne(parentId);
    const student = await this.studentsRepository.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Check if student is already associated with parent
    const isAlreadyAssociated = parent.students.some(s => s.id === studentId);
    if (!isAlreadyAssociated) {
      parent.students.push(student);
      await this.parentsRepository.save(parent);
    }

    return this.findOne(parentId);
  }

  async removeStudentFromParent(parentId: string, studentId: string): Promise<Parent> {
    const parent = await this.findOne(parentId);

    // Filter out the student to remove
    parent.students = parent.students.filter(student => student.id !== studentId);
    await this.parentsRepository.save(parent);

    return this.findOne(parentId);
  }

  async bulkDelete(ids: string[], userId?: string): Promise<void> {
    // Update deletedBy for all parents
    await this.parentsRepository.update(
      { id: In(ids) },
      { deletedBy: userId }
    );

    // Soft delete all parents
    await this.parentsRepository.softDelete(ids);
  }

  async countParents(filters?: any): Promise<number> {
    return this.parentsRepository.count({
      where: filters,
    });
  }
}

