import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Not, IsNull } from 'typeorm';
import { Student, StudentStatus } from '../entities/student.entity';
import { CreateStudentDto, UpdateStudentDto, StudentFilterDto } from '../dto';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createStudentDto: CreateStudentDto, userId?: string): Promise<Student> {
    // Check if student with same admission number already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { admissionNumber: createStudentDto.admissionNumber },
      withDeleted: true,
    });

    if (existingStudent) {
      throw new ConflictException(`Student with admission number ${createStudentDto.admissionNumber} already exists`);
    }

    // Create new student
    const student = this.studentsRepository.create({
      ...createStudentDto,
      createdBy: userId,
    });

    // Handle user account creation if requested
    if (createStudentDto.createUserAccount && !createStudentDto.userId) {
      // Logic to create user account would go here
      // This would typically involve calling a user service
    }

    return this.studentsRepository.save(student);
  }

  async findAll(filterDto: StudentFilterDto): Promise<[Student[], number]> {
    const { 
      name, 
      admissionNumber, 
      classId, 
      sectionId, 
      academicYearId,
      gender,
      status,
      admissionDateFrom,
      admissionDateTo,
      dateOfBirthFrom,
      dateOfBirthTo,
      nationality,
      religion,
      house,
      busRouteNumber,
      hostelRoomNumber,
      feeCategory,
      includeInactive,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filterDto;

    const query = this.studentsRepository.createQueryBuilder('student');

    // Apply filters
    if (name) {
      query.andWhere(
        '(student.firstName LIKE :name OR student.lastName LIKE :name OR student.middleName LIKE :name)',
        { name: `%${name}%` }
      );
    }

    if (admissionNumber) {
      query.andWhere('student.admissionNumber LIKE :admissionNumber', { admissionNumber: `%${admissionNumber}%` });
    }

    if (classId) {
      query.andWhere('student.currentClassId = :classId', { classId });
    }

    if (sectionId) {
      query.andWhere('student.currentSectionId = :sectionId', { sectionId });
    }

    if (academicYearId) {
      query.andWhere('student.academicYearId = :academicYearId', { academicYearId });
    }

    if (gender) {
      query.andWhere('student.gender = :gender', { gender });
    }

    if (status) {
      query.andWhere('student.status = :status', { status });
    } else if (!includeInactive) {
      query.andWhere('student.status = :status', { status: StudentStatus.ACTIVE });
    }

    if (admissionDateFrom) {
      query.andWhere('student.admissionDate >= :admissionDateFrom', { admissionDateFrom });
    }

    if (admissionDateTo) {
      query.andWhere('student.admissionDate <= :admissionDateTo', { admissionDateTo });
    }

    if (dateOfBirthFrom) {
      query.andWhere('student.dateOfBirth >= :dateOfBirthFrom', { dateOfBirthFrom });
    }

    if (dateOfBirthTo) {
      query.andWhere('student.dateOfBirth <= :dateOfBirthTo', { dateOfBirthTo });
    }

    if (nationality) {
      query.andWhere('student.nationality LIKE :nationality', { nationality: `%${nationality}%` });
    }

    if (religion) {
      query.andWhere('student.religion LIKE :religion', { religion: `%${religion}%` });
    }

    if (house) {
      query.andWhere('student.house LIKE :house', { house: `%${house}%` });
    }

    if (busRouteNumber) {
      query.andWhere('student.busRouteNumber LIKE :busRouteNumber', { busRouteNumber: `%${busRouteNumber}%` });
    }

    if (hostelRoomNumber) {
      query.andWhere('student.hostelRoomNumber LIKE :hostelRoomNumber', { hostelRoomNumber: `%${hostelRoomNumber}%` });
    }

    if (feeCategory) {
      query.andWhere('student.feeCategory LIKE :feeCategory', { feeCategory: `%${feeCategory}%` });
    }

    // Add relations
    query.leftJoinAndSelect('student.user', 'user');

    // Add pagination
    query.skip((page - 1) * limit)
      .take(limit)
      .orderBy(`student.${sortBy}`, sortOrder);

    // Execute query
    const [students, total] = await query.getManyAndCount();
    return [students, total];
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async findByAdmissionNumber(admissionNumber: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { admissionNumber },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Student with admission number ${admissionNumber} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, userId?: string): Promise<Student> {
    const student = await this.findOne(id);

    // Update student
    Object.assign(student, {
      ...updateStudentDto,
      updatedBy: userId,
    });

    return this.studentsRepository.save(student);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const student = await this.findOne(id);

    // Soft delete
    student.deletedBy = userId;
    await this.studentsRepository.save(student);
    await this.studentsRepository.softDelete(id);
  }

  async restore(id: string): Promise<Student> {
    // Check if student exists in deleted records
    const student = await this.studentsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    if (!student.deletedAt) {
      throw new BadRequestException(`Student with ID ${id} is not deleted`);
    }

    // Restore student
    await this.studentsRepository.restore(id);
    return this.findOne(id);
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { currentClassId: classId, status: StudentStatus.ACTIVE },
    });
  }

  async getStudentsBySection(sectionId: string): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { currentSectionId: sectionId, status: StudentStatus.ACTIVE },
    });
  }

  async getStudentsByAcademicYear(academicYearId: string): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { academicYearId, status: StudentStatus.ACTIVE },
    });
  }

  async updateStudentStatus(id: string, status: StudentStatus, userId?: string): Promise<Student> {
    const student = await this.findOne(id);
    student.status = status;
    student.updatedBy = userId;
    return this.studentsRepository.save(student);
  }

  async bulkUpdateStatus(ids: string[], status: StudentStatus, userId?: string): Promise<void> {
    await this.studentsRepository.update(
      { id: In(ids) },
      { status, updatedBy: userId }
    );
  }

  async bulkDelete(ids: string[], userId?: string): Promise<void> {
    // Update deletedBy for all students
    await this.studentsRepository.update(
      { id: In(ids) },
      { deletedBy: userId }
    );

    // Soft delete all students
    await this.studentsRepository.softDelete(ids);
  }

  async countStudents(filters?: any): Promise<number> {
    return this.studentsRepository.count({
      where: filters,
    });
  }

  async getStudentStatistics(): Promise<any> {
    const totalStudents = await this.countStudents();
    const activeStudents = await this.countStudents({ status: StudentStatus.ACTIVE });
    const inactiveStudents = await this.countStudents({ status: StudentStatus.INACTIVE });
    const graduatedStudents = await this.countStudents({ status: StudentStatus.GRADUATED });
    const transferredStudents = await this.countStudents({ status: StudentStatus.TRANSFERRED });

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
      transferredStudents,
    };
  }
}

