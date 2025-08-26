import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, In } from 'typeorm';
import { Class, ClassStatus } from './entities/class.entity';
import { Section, SectionStatus } from './entities/section.entity';
import {
  CreateClassDto,
  UpdateClassDto,
  ClassFilterDto,
  CreateSectionDto,
  UpdateSectionDto,
  SectionFilterDto,
} from './dto';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { AcademicYear } from '../academic/entities/academic-year.entity';
import { Subject } from '../academic/entities/subject.entity';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(AcademicYear)
    private academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  // Class Methods
  async findAllClasses(filterDto: ClassFilterDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'level',
      sortOrder = 'ASC',
      name,
      grade,
      level,
      status,
      academicYearId,
      headTeacherId,
      teacherId,
      subjectId,
    } = filterDto;

    const skip = (page - 1) * limit;
    
    const whereClause: FindOptionsWhere<Class> = {};
    
    // Apply filters
    if (name) {
      whereClause.name = Like(`%${name}%`);
    }
    
    if (grade) {
      whereClause.grade = Like(`%${grade}%`);
    }
    
    if (level !== undefined) {
      whereClause.level = level;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (academicYearId) {
      whereClause.academicYearId = academicYearId;
    }
    
    if (headTeacherId) {
      whereClause.headTeacherId = headTeacherId;
    }

    // Create query builder for more complex queries
    let query = this.classRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.sections', 'section')
      .leftJoinAndSelect('class.headTeacher', 'headTeacher')
      .leftJoinAndSelect('class.academicYear', 'academicYear');
    
    // Apply where clause
    if (Object.keys(whereClause).length > 0) {
      for (const [key, value] of Object.entries(whereClause)) {
        if (value instanceof Object && 'operator' in value) {
          // Handle complex operators like Like
          query = query.andWhere(`class.${key} ${value['operator']} :${key}Value`, {
            [`${key}Value`]: value['value']
          });
        } else {
          query = query.andWhere(`class.${key} = :${key}`, { [key]: value });
        }
      }
    }
    
    // Handle teacher filter
    if (teacherId) {
      query = query
        .leftJoin('class.teachers', 'teacher')
        .andWhere('teacher.id = :teacherId', { teacherId });
    }
    
    // Handle subject filter
    if (subjectId) {
      query = query
        .leftJoin('class.subjects', 'subject')
        .andWhere('subject.id = :subjectId', { subjectId });
    }
    
    // Apply pagination and sorting
    query = query
      .skip(skip)
      .take(limit)
      .orderBy(`class.${sortBy}`, sortOrder);
    
    const [classes, total] = await query.getManyAndCount();

    return {
      data: classes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findClassById(id: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: [
        'sections',
        'headTeacher',
        'academicYear',
        'teachers',
        'subjects',
      ],
    });
    
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    
    return classEntity;
  }

  async createClass(createClassDto: CreateClassDto, currentUserId?: string) {
    // Check if class with the same name already exists
    const existingClass = await this.classRepository.findOne({
      where: { name: createClassDto.name },
    });
    
    if (existingClass) {
      throw new ConflictException(`Class with name ${createClassDto.name} already exists`);
    }

    // Verify academic year if provided
    let academicYear: AcademicYear | null = null;
    if (createClassDto.academicYearId) {
      academicYear = await this.academicYearRepository.findOne({
        where: { id: createClassDto.academicYearId },
      });
      
      if (!academicYear) {
        throw new BadRequestException(`Academic year with ID ${createClassDto.academicYearId} not found`);
      }
    }

    // Verify head teacher if provided
    let headTeacher: User | null = null;
    if (createClassDto.headTeacherId) {
      headTeacher = await this.userRepository.findOne({
        where: { id: createClassDto.headTeacherId },
      });
      
      if (!headTeacher) {
        throw new BadRequestException(`Head teacher with ID ${createClassDto.headTeacherId} not found`);
      }
    }

    // Verify teachers if provided
    let teachers: User[] = [];
    if (createClassDto.teacherIds && createClassDto.teacherIds.length > 0) {
      teachers = await this.userRepository.find({
        where: { id: In(createClassDto.teacherIds) },
      });
      
      if (teachers.length !== createClassDto.teacherIds.length) {
        throw new BadRequestException('One or more teacher IDs are invalid');
      }
    }

    // Verify subjects if provided
    let subjects: Subject[] = [];
    if (createClassDto.subjectIds && createClassDto.subjectIds.length > 0) {
      subjects = await this.subjectRepository.find({
        where: { id: In(createClassDto.subjectIds) },
      });
      
      if (subjects.length !== createClassDto.subjectIds.length) {
        throw new BadRequestException('One or more subject IDs are invalid');
      }
    }

    // Create class entity
    const classEntity = this.classRepository.create({
      ...createClassDto,
      teachers,
      subjects,
      createdBy: currentUserId,
    });
    
    try {
      const savedClass = await this.classRepository.save(classEntity);
      this.logger.log(`Created class with ID ${savedClass.id}`);
      
      // Return class with relations
      savedClass.academicYear = academicYear;
      savedClass.headTeacher = headTeacher;
      savedClass.teachers = teachers;
      savedClass.subjects = subjects;
      
      return savedClass;
    } catch (error) {
      this.logger.error(`Failed to create class: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create class');
    }
  }

  async updateClass(id: string, updateClassDto: UpdateClassDto, currentUserId?: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers', 'subjects'],
    });
    
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Check if name is being updated and if it already exists
    if (updateClassDto.name && updateClassDto.name !== classEntity.name) {
      const existingClass = await this.classRepository.findOne({
        where: { name: updateClassDto.name },
      });
      
      if (existingClass && existingClass.id !== id) {
        throw new ConflictException(`Class with name ${updateClassDto.name} already exists`);
      }
    }

    // Update academic year if provided
    if (updateClassDto.academicYearId) {
      const academicYear = await this.academicYearRepository.findOne({
        where: { id: updateClassDto.academicYearId },
      });
      
      if (!academicYear) {
        throw new BadRequestException(`Academic year with ID ${updateClassDto.academicYearId} not found`);
      }
    }

    // Update head teacher if provided
    if (updateClassDto.headTeacherId) {
      const headTeacher = await this.userRepository.findOne({
        where: { id: updateClassDto.headTeacherId },
      });
      
      if (!headTeacher) {
        throw new BadRequestException(`Head teacher with ID ${updateClassDto.headTeacherId} not found`);
      }
    }

    // Update teachers if provided
    if (updateClassDto.teacherIds) {
      const teachers = await this.userRepository.find({
        where: { id: In(updateClassDto.teacherIds) },
      });
      
      if (teachers.length !== updateClassDto.teacherIds.length) {
        throw new BadRequestException('One or more teacher IDs are invalid');
      }
      
      classEntity.teachers = teachers;
    }

    // Update subjects if provided
    if (updateClassDto.subjectIds) {
      const subjects = await this.subjectRepository.find({
        where: { id: In(updateClassDto.subjectIds) },
      });
      
      if (subjects.length !== updateClassDto.subjectIds.length) {
        throw new BadRequestException('One or more subject IDs are invalid');
      }
      
      classEntity.subjects = subjects;
    }

    // Update class
    Object.assign(classEntity, {
      ...updateClassDto,
      updatedBy: currentUserId,
    });
    
    // Remove properties that should be handled separately
    delete classEntity['teacherIds'];
    delete classEntity['subjectIds'];
    
    try {
      const updatedClass = await this.classRepository.save(classEntity);
      this.logger.log(`Updated class with ID ${id}`);
      return updatedClass;
    } catch (error) {
      this.logger.error(`Failed to update class: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update class');
    }
  }

  async removeClass(id: string, currentUserId?: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['sections', 'students'],
    });
    
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Check if class has students
    if (classEntity.students && classEntity.students.length > 0) {
      throw new BadRequestException('Cannot delete class with enrolled students');
    }

    // Check if class has sections
    if (classEntity.sections && classEntity.sections.length > 0) {
      throw new BadRequestException('Cannot delete class with sections. Delete sections first.');
    }

    // Soft delete the class
    classEntity.deletedBy = currentUserId;
    await this.classRepository.softRemove(classEntity);
    
    this.logger.log(`Deleted class with ID ${id}`);
    return { id, deleted: true };
  }

  // Section Methods
  async findAllSections(filterDto: SectionFilterDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
      name,
      status,
      classId,
      classSectionTeacherId,
      teacherId,
    } = filterDto;

    const skip = (page - 1) * limit;
    
    const whereClause: FindOptionsWhere<Section> = {};
    
    // Apply filters
    if (name) {
      whereClause.name = Like(`%${name}%`);
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (classId) {
      whereClause.classId = classId;
    }
    
    if (classSectionTeacherId) {
      whereClause.classSectionTeacherId = classSectionTeacherId;
    }

    // Create query builder for more complex queries
    let query = this.sectionRepository.createQueryBuilder('section')
      .leftJoinAndSelect('section.class', 'class')
      .leftJoinAndSelect('section.classSectionTeacher', 'classSectionTeacher');
    
    // Apply where clause
    if (Object.keys(whereClause).length > 0) {
      for (const [key, value] of Object.entries(whereClause)) {
        if (value instanceof Object && 'operator' in value) {
          // Handle complex operators like Like
          query = query.andWhere(`section.${key} ${value['operator']} :${key}Value`, {
            [`${key}Value`]: value['value']
          });
        } else {
          query = query.andWhere(`section.${key} = :${key}`, { [key]: value });
        }
      }
    }
    
    // Handle teacher filter
    if (teacherId) {
      query = query
        .leftJoin('section.teachers', 'teacher')
        .andWhere('teacher.id = :teacherId', { teacherId });
    }
    
    // Apply pagination and sorting
    query = query
      .skip(skip)
      .take(limit)
      .orderBy(`section.${sortBy}`, sortOrder);
    
    const [sections, total] = await query.getManyAndCount();

    return {
      data: sections,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findSectionById(id: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: [
        'class',
        'classSectionTeacher',
        'teachers',
        'students',
      ],
    });
    
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    
    return section;
  }

  async createSection(createSectionDto: CreateSectionDto, currentUserId?: string) {
    // Check if class exists
    const classEntity = await this.classRepository.findOne({
      where: { id: createSectionDto.classId },
    });
    
    if (!classEntity) {
      throw new BadRequestException(`Class with ID ${createSectionDto.classId} not found`);
    }

    // Check if section with the same name already exists in the class
    const existingSection = await this.sectionRepository.findOne({
      where: {
        name: createSectionDto.name,
        classId: createSectionDto.classId,
      },
    });
    
    if (existingSection) {
      throw new ConflictException(`Section with name ${createSectionDto.name} already exists in this class`);
    }

    // Verify class section teacher if provided
    let classSectionTeacher: User | null = null;
    if (createSectionDto.classSectionTeacherId) {
      classSectionTeacher = await this.userRepository.findOne({
        where: { id: createSectionDto.classSectionTeacherId },
      });
      
      if (!classSectionTeacher) {
        throw new BadRequestException(`Teacher with ID ${createSectionDto.classSectionTeacherId} not found`);
      }
    }

    // Verify teachers if provided
    let teachers: User[] = [];
    if (createSectionDto.teacherIds && createSectionDto.teacherIds.length > 0) {
      teachers = await this.userRepository.find({
        where: { id: In(createSectionDto.teacherIds) },
      });
      
      if (teachers.length !== createSectionDto.teacherIds.length) {
        throw new BadRequestException('One or more teacher IDs are invalid');
      }
    }

    // Create section entity
    const section = this.sectionRepository.create({
      ...createSectionDto,
      teachers,
      createdBy: currentUserId,
    });
    
    try {
      const savedSection = await this.sectionRepository.save(section);
      this.logger.log(`Created section with ID ${savedSection.id}`);
      
      // Return section with relations
      savedSection.class = classEntity;
      savedSection.classSectionTeacher = classSectionTeacher;
      savedSection.teachers = teachers;
      
      return savedSection;
    } catch (error) {
      this.logger.error(`Failed to create section: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create section');
    }
  }

  async updateSection(id: string, updateSectionDto: UpdateSectionDto, currentUserId?: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['teachers'],
    });
    
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    // Check if class is being updated and if it exists
    if (updateSectionDto.classId && updateSectionDto.classId !== section.classId) {
      const classEntity = await this.classRepository.findOne({
        where: { id: updateSectionDto.classId },
      });
      
      if (!classEntity) {
        throw new BadRequestException(`Class with ID ${updateSectionDto.classId} not found`);
      }
    }

    // Check if name is being updated and if it already exists in the class
    if (updateSectionDto.name && updateSectionDto.name !== section.name) {
      const classId = updateSectionDto.classId || section.classId;
      const existingSection = await this.sectionRepository.findOne({
        where: {
          name: updateSectionDto.name,
          classId,
        },
      });
      
      if (existingSection && existingSection.id !== id) {
        throw new ConflictException(`Section with name ${updateSectionDto.name} already exists in this class`);
      }
    }

    // Update class section teacher if provided
    if (updateSectionDto.classSectionTeacherId) {
      const classSectionTeacher = await this.userRepository.findOne({
        where: { id: updateSectionDto.classSectionTeacherId },
      });
      
      if (!classSectionTeacher) {
        throw new BadRequestException(`Teacher with ID ${updateSectionDto.classSectionTeacherId} not found`);
      }
    }

    // Update teachers if provided
    if (updateSectionDto.teacherIds) {
      const teachers = await this.userRepository.find({
        where: { id: In(updateSectionDto.teacherIds) },
      });
      
      if (teachers.length !== updateSectionDto.teacherIds.length) {
        throw new BadRequestException('One or more teacher IDs are invalid');
      }
      
      section.teachers = teachers;
    }

    // Update section
    Object.assign(section, {
      ...updateSectionDto,
      updatedBy: currentUserId,
    });
    
    // Remove properties that should be handled separately
    delete section['teacherIds'];
    
    try {
      const updatedSection = await this.sectionRepository.save(section);
      this.logger.log(`Updated section with ID ${id}`);
      return updatedSection;
    } catch (error) {
      this.logger.error(`Failed to update section: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update section');
    }
  }

  async removeSection(id: string, currentUserId?: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    // Check if section has students
    if (section.students && section.students.length > 0) {
      throw new BadRequestException('Cannot delete section with enrolled students');
    }

    // Soft delete the section
    section.deletedBy = currentUserId;
    await this.sectionRepository.softRemove(section);
    
    this.logger.log(`Deleted section with ID ${id}`);
    return { id, deleted: true };
  }

  // Class Statistics
  async getClassStats() {
    const totalClasses = await this.classRepository.count();
    
    const activeClasses = await this.classRepository.count({
      where: { status: ClassStatus.ACTIVE },
    });
    
    const inactiveClasses = await this.classRepository.count({
      where: { status: ClassStatus.INACTIVE },
    });
    
    const archivedClasses = await this.classRepository.count({
      where: { status: ClassStatus.ARCHIVED },
    });
    
    const totalSections = await this.sectionRepository.count();
    
    const activeSections = await this.sectionRepository.count({
      where: { status: SectionStatus.ACTIVE },
    });
    
    const inactiveSections = await this.sectionRepository.count({
      where: { status: SectionStatus.INACTIVE },
    });
    
    const archivedSections = await this.sectionRepository.count({
      where: { status: SectionStatus.ARCHIVED },
    });
    
    // Get total enrolled students
    const totalEnrolledStudents = await this.studentRepository.count({
      where: { currentClassId: Not(IsNull()) },
    });
    
    // Get classes by grade
    const classesByGrade = await this.classRepository
      .createQueryBuilder('class')
      .select('class.grade', 'grade')
      .addSelect('COUNT(class.id)', 'count')
      .groupBy('class.grade')
      .getRawMany();
    
    return {
      totalClasses,
      activeClasses,
      inactiveClasses,
      archivedClasses,
      totalSections,
      activeSections,
      inactiveSections,
      archivedSections,
      totalEnrolledStudents,
      classesByGrade,
    };
  }

  // Student Enrollment
  async enrollStudentInSection(studentId: string, sectionId: string, currentUserId?: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['class'],
    });
    
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    
    // Check if section is active
    if (section.status !== SectionStatus.ACTIVE) {
      throw new BadRequestException(`Cannot enroll student in inactive or archived section`);
    }
    
    // Check if section has reached capacity
    if (section.capacity && section.enrolledStudents >= section.capacity) {
      throw new BadRequestException(`Section has reached maximum capacity`);
    }
    
    // Update student
    student.currentClassId = section.classId;
    student.currentSectionId = sectionId;
    student.updatedBy = currentUserId;
    
    // Update section and class enrollment counts
    section.enrolledStudents += 1;
    section.updatedBy = currentUserId;
    
    section.class.enrolledStudents += 1;
    section.class.updatedBy = currentUserId;
    
    try {
      await this.studentRepository.save(student);
      await this.sectionRepository.save(section);
      await this.classRepository.save(section.class);
      
      this.logger.log(`Enrolled student ${studentId} in section ${sectionId}`);
      
      return {
        studentId,
        sectionId,
        classId: section.classId,
        enrolled: true,
      };
    } catch (error) {
      this.logger.error(`Failed to enroll student: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to enroll student');
    }
  }

  async removeStudentFromSection(studentId: string, currentUserId?: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['currentSection', 'currentClass'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    
    if (!student.currentSectionId) {
      throw new BadRequestException(`Student is not enrolled in any section`);
    }
    
    const sectionId = student.currentSectionId;
    const classId = student.currentClassId;
    
    // Update student
    student.currentClassId = null;
    student.currentSectionId = null;
    student.updatedBy = currentUserId;
    
    // Update section and class enrollment counts
    if (student.currentSection) {
      student.currentSection.enrolledStudents -= 1;
      student.currentSection.updatedBy = currentUserId;
    }
    
    if (student.currentClass) {
      student.currentClass.enrolledStudents -= 1;
      student.currentClass.updatedBy = currentUserId;
    }
    
    try {
      await this.studentRepository.save(student);
      
      if (student.currentSection) {
        await this.sectionRepository.save(student.currentSection);
      }
      
      if (student.currentClass) {
        await this.classRepository.save(student.currentClass);
      }
      
      this.logger.log(`Removed student ${studentId} from section ${sectionId}`);
      
      return {
        studentId,
        sectionId,
        classId,
        removed: true,
      };
    } catch (error) {
      this.logger.error(`Failed to remove student from section: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to remove student from section');
    }
  }

  // Bulk Operations
  async bulkCreateClasses(dtos: CreateClassDto[], currentUserId?: string) {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const dto of dtos) {
      try {
        await this.createClass(dto, currentUserId);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          name: dto.name,
          error: error.message,
        });
      }
    }

    return results;
  }

  async bulkCreateSections(dtos: CreateSectionDto[], currentUserId?: string) {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const dto of dtos) {
      try {
        await this.createSection(dto, currentUserId);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          name: dto.name,
          classId: dto.classId,
          error: error.message,
        });
      }
    }

    return results;
  }
}

