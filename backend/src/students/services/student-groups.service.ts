import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentGroup } from '../entities/student-group.entity';
import { Student } from '../entities/student.entity';
import { CreateStudentGroupDto } from '../dto/group/create-student-group.dto';
import { UpdateStudentGroupDto } from '../dto/group/update-student-group.dto';

@Injectable()
export class StudentGroupsService {
  constructor(
    @InjectRepository(StudentGroup)
    private groupsRepository: Repository<StudentGroup>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createGroupDto: CreateStudentGroupDto, userId?: string): Promise<StudentGroup> {
    // Create new group
    const group = this.groupsRepository.create({
      ...createGroupDto,
      createdBy: userId,
    });

    // Save group first to get ID
    const savedGroup = await this.groupsRepository.save(group);

    // Associate students if provided
    if (createGroupDto.studentIds && createGroupDto.studentIds.length > 0) {
      const students = await this.studentsRepository.findBy({
        id: In(createGroupDto.studentIds),
      });

      if (students.length > 0) {
        savedGroup.students = students;
        await this.groupsRepository.save(savedGroup);
      }
    }

    return this.findOne(savedGroup.id);
  }

  async findAll(filters?: any): Promise<[StudentGroup[], number]> {
    const { 
      name, 
      type, 
      academicYearId, 
      isActive = true,
      parentGroupId,
      leaderId,
      page = 1, 
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = filters || {};

    const query = this.groupsRepository.createQueryBuilder('group');

    // Apply filters
    if (name) {
      query.andWhere('group.name LIKE :name', { name: `%${name}%` });
    }

    if (type) {
      query.andWhere('group.type = :type', { type });
    }

    if (academicYearId) {
      query.andWhere('group.academicYearId = :academicYearId', { academicYearId });
    }

    if (isActive !== undefined) {
      query.andWhere('group.isActive = :isActive', { isActive });
    }

    if (parentGroupId) {
      query.andWhere('group.parentGroupId = :parentGroupId', { parentGroupId });
    }

    if (leaderId) {
      query.andWhere('group.leaderId = :leaderId', { leaderId });
    }

    // Add relations
    query.leftJoinAndSelect('group.students', 'students');

    // Add pagination
    query.skip((page - 1) * limit)
      .take(limit)
      .orderBy(`group.${sortBy}`, sortOrder);

    // Execute query
    const [groups, total] = await query.getManyAndCount();
    return [groups, total];
  }

  async findOne(id: string): Promise<StudentGroup> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['students'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateStudentGroupDto, userId?: string): Promise<StudentGroup> {
    const group = await this.findOne(id);

    // Update group
    Object.assign(group, {
      ...updateGroupDto,
      updatedBy: userId,
    });

    // Handle student associations
    if (updateGroupDto.replaceStudentIds) {
      // Replace all students
      const students = await this.studentsRepository.findBy({
        id: In(updateGroupDto.replaceStudentIds),
      });
      group.students = students;
    } else {
      // Add students
      if (updateGroupDto.addStudentIds && updateGroupDto.addStudentIds.length > 0) {
        const studentsToAdd = await this.studentsRepository.findBy({
          id: In(updateGroupDto.addStudentIds),
        });
        
        // Initialize students array if it doesn't exist
        if (!group.students) {
          group.students = [];
        }
        
        // Add new students (avoiding duplicates)
        const existingIds = group.students.map(s => s.id);
        for (const student of studentsToAdd) {
          if (!existingIds.includes(student.id)) {
            group.students.push(student);
          }
        }
      }

      // Remove students
      if (updateGroupDto.removeStudentIds && updateGroupDto.removeStudentIds.length > 0) {
        if (group.students && group.students.length > 0) {
          group.students = group.students.filter(
            student => !updateGroupDto.removeStudentIds.includes(student.id)
          );
        }
      }
    }

    return this.groupsRepository.save(group);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const group = await this.findOne(id);

    // Soft delete
    group.deletedBy = userId;
    await this.groupsRepository.save(group);
    await this.groupsRepository.softDelete(id);
  }

  async restore(id: string): Promise<StudentGroup> {
    // Check if group exists in deleted records
    const group = await this.groupsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (!group.deletedAt) {
      throw new BadRequestException(`Group with ID ${id} is not deleted`);
    }

    // Restore group
    await this.groupsRepository.restore(id);
    return this.findOne(id);
  }

  async getGroupsByStudent(studentId: string): Promise<StudentGroup[]> {
    const query = this.groupsRepository.createQueryBuilder('group')
      .innerJoin('group.students', 'student', 'student.id = :studentId', { studentId })
      .where('group.isActive = :isActive', { isActive: true });

    return query.getMany();
  }

  async addStudentToGroup(groupId: string, studentId: string): Promise<StudentGroup> {
    const group = await this.findOne(groupId);
    const student = await this.studentsRepository.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Check if student is already in the group
    const isAlreadyInGroup = group.students.some(s => s.id === studentId);
    if (!isAlreadyInGroup) {
      group.students.push(student);
      await this.groupsRepository.save(group);
    }

    return this.findOne(groupId);
  }

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<StudentGroup> {
    const group = await this.findOne(groupId);

    // Filter out the student to remove
    group.students = group.students.filter(student => student.id !== studentId);
    await this.groupsRepository.save(group);

    return this.findOne(groupId);
  }

  async bulkDelete(ids: string[], userId?: string): Promise<void> {
    // Update deletedBy for all groups
    await this.groupsRepository.update(
      { id: In(ids) },
      { deletedBy: userId }
    );

    // Soft delete all groups
    await this.groupsRepository.softDelete(ids);
  }

  async countGroups(filters?: any): Promise<number> {
    return this.groupsRepository.count({
      where: filters,
    });
  }
}

