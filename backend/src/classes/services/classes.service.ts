import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between, FindOptionsWhere } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Course } from '../entities/course.entity';
import { Class } from '../entities/class.entity';
import { Term } from '../entities/term.entity';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { CreateTermDto } from '../dto/create-term.dto';
import { UpdateTermDto } from '../dto/update-term.dto';
import { CreateClassScheduleDto } from '../dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from '../dto/update-class-schedule.dto';
import { CourseFilterDto } from '../dto/course-filter.dto';
import { ClassFilterDto } from '../dto/class-filter.dto';
import { TermFilterDto } from '../dto/term-filter.dto';
import { EnrollStudentsDto } from '../dto/enroll-students.dto';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(ClassSchedule)
    private scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Course Management
   */
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Check if course code already exists
      const existingCourse = await this.courseRepository.findOne({
        where: { code: createCourseDto.code },
      });

      if (existingCourse) {
        throw new ConflictException(`Course with code ${createCourseDto.code} already exists`);
      }

      // Create course
      const course = this.courseRepository.create(createCourseDto);
      return this.courseRepository.save(course);
    } catch (error) {
      this.logger.error(`Failed to create course: ${error.message}`);
      throw error;
    }
  }

  async findAllCourses(filterDto: CourseFilterDto): Promise<Course[]> {
    try {
      const { search, department, minGradeLevel, maxGradeLevel, isActive } = filterDto;
      const queryBuilder = this.courseRepository.createQueryBuilder('course');

      // Apply search filter
      if (search) {
        queryBuilder.andWhere(
          '(course.code ILIKE :search OR course.name ILIKE :search OR course.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Apply other filters
      if (department) {
        queryBuilder.andWhere('course.department = :department', { department });
      }

      if (minGradeLevel) {
        queryBuilder.andWhere('course.minGradeLevel = :minGradeLevel', { minGradeLevel });
      }

      if (maxGradeLevel) {
        queryBuilder.andWhere('course.maxGradeLevel = :maxGradeLevel', { maxGradeLevel });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('course.isActive = :isActive', { isActive });
      }

      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find courses: ${error.message}`);
      throw error;
    }
  }

  async findCourseById(id: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['classes'],
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return course;
    } catch (error) {
      this.logger.error(`Failed to find course: ${error.message}`);
      throw error;
    }
  }

  async findCourseByCode(code: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { code },
        relations: ['classes'],
      });

      if (!course) {
        throw new NotFoundException(`Course with code ${code} not found`);
      }

      return course;
    } catch (error) {
      this.logger.error(`Failed to find course by code: ${error.message}`);
      throw error;
    }
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.findCourseById(id);

      // Check if code is being updated and already exists
      if (updateCourseDto.code && updateCourseDto.code !== course.code) {
        const existingCourse = await this.courseRepository.findOne({
          where: { code: updateCourseDto.code },
        });

        if (existingCourse && existingCourse.id !== id) {
          throw new ConflictException(`Course with code ${updateCourseDto.code} already exists`);
        }
      }

      // Update course
      const updatedCourse = await this.courseRepository.save({
        ...course,
        ...updateCourseDto,
      });

      return updatedCourse;
    } catch (error) {
      this.logger.error(`Failed to update course: ${error.message}`);
      throw error;
    }
  }

  async removeCourse(id: string): Promise<Course> {
    try {
      const course = await this.findCourseById(id);

      // Check if course has classes
      if (course.classes && course.classes.length > 0) {
        throw new BadRequestException(`Cannot delete course with existing classes`);
      }

      return this.courseRepository.remove(course);
    } catch (error) {
      this.logger.error(`Failed to remove course: ${error.message}`);
      throw error;
    }
  }

  /**
   * Term Management
   */
  async createTerm(createTermDto: CreateTermDto): Promise<Term> {
    try {
      // Create term
      const term = this.termRepository.create(createTermDto);

      // If this term is set as current, update other terms
      if (term.isCurrent) {
        await this.termRepository.update({}, { isCurrent: false });
      }

      return this.termRepository.save(term);
    } catch (error) {
      this.logger.error(`Failed to create term: ${error.message}`);
      throw error;
    }
  }

  async findAllTerms(filterDto: TermFilterDto): Promise<Term[]> {
    try {
      const { 
        search, 
        academicYear, 
        type, 
        isActive, 
        isCurrent,
        startDateAfter,
        endDateBefore
      } = filterDto;
      
      const queryBuilder = this.termRepository.createQueryBuilder('term');

      // Apply search filter
      if (search) {
        queryBuilder.andWhere('term.name ILIKE :search', { search: `%${search}%` });
      }

      // Apply other filters
      if (academicYear) {
        queryBuilder.andWhere('term.academicYear = :academicYear', { academicYear });
      }

      if (type) {
        queryBuilder.andWhere('term.type = :type', { type });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('term.isActive = :isActive', { isActive });
      }

      if (isCurrent !== undefined) {
        queryBuilder.andWhere('term.isCurrent = :isCurrent', { isCurrent });
      }

      if (startDateAfter) {
        queryBuilder.andWhere('term.startDate >= :startDateAfter', { startDateAfter });
      }

      if (endDateBefore) {
        queryBuilder.andWhere('term.endDate <= :endDateBefore', { endDateBefore });
      }

      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find terms: ${error.message}`);
      throw error;
    }
  }

  async findTermById(id: string): Promise<Term> {
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: ['classes'],
      });

      if (!term) {
        throw new NotFoundException(`Term with ID ${id} not found`);
      }

      return term;
    } catch (error) {
      this.logger.error(`Failed to find term: ${error.message}`);
      throw error;
    }
  }

  async findCurrentTerm(): Promise<Term> {
    try {
      const term = await this.termRepository.findOne({
        where: { isCurrent: true },
      });

      if (!term) {
        throw new NotFoundException(`No current term found`);
      }

      return term;
    } catch (error) {
      this.logger.error(`Failed to find current term: ${error.message}`);
      throw error;
    }
  }

  async updateTerm(id: string, updateTermDto: UpdateTermDto): Promise<Term> {
    try {
      const term = await this.findTermById(id);

      // If this term is being set as current, update other terms
      if (updateTermDto.isCurrent) {
        await this.termRepository.update({}, { isCurrent: false });
      }

      // Update term
      const updatedTerm = await this.termRepository.save({
        ...term,
        ...updateTermDto,
      });

      return updatedTerm;
    } catch (error) {
      this.logger.error(`Failed to update term: ${error.message}`);
      throw error;
    }
  }

  async removeTerm(id: string): Promise<Term> {
    try {
      const term = await this.findTermById(id);

      // Check if term has classes
      if (term.classes && term.classes.length > 0) {
        throw new BadRequestException(`Cannot delete term with existing classes`);
      }

      return this.termRepository.remove(term);
    } catch (error) {
      this.logger.error(`Failed to remove term: ${error.message}`);
      throw error;
    }
  }

  /**
   * Class Management
   */
  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    try {
      // Check if class code already exists
      const existingClass = await this.classRepository.findOne({
        where: { code: createClassDto.code },
      });

      if (existingClass) {
        throw new ConflictException(`Class with code ${createClassDto.code} already exists`);
      }

      // Check if course exists
      const course = await this.courseRepository.findOne({
        where: { id: createClassDto.courseId },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${createClassDto.courseId} not found`);
      }

      // Check if term exists
      const term = await this.termRepository.findOne({
        where: { id: createClassDto.termId },
      });

      if (!term) {
        throw new NotFoundException(`Term with ID ${createClassDto.termId} not found`);
      }

      // Check if primary teacher exists
      if (createClassDto.primaryTeacherId) {
        const teacher = await this.userRepository.findOne({
          where: { id: createClassDto.primaryTeacherId },
        });

        if (!teacher) {
          throw new NotFoundException(`Teacher with ID ${createClassDto.primaryTeacherId} not found`);
        }
      }

      // Create class
      const classEntity = this.classRepository.create(createClassDto);
      classEntity.enrollmentCount = 0;
      
      // Handle assistant teachers if provided
      if (createClassDto.assistantTeacherIds && createClassDto.assistantTeacherIds.length > 0) {
        const assistantTeachers = await this.userRepository.find({
          where: { id: In(createClassDto.assistantTeacherIds) },
        });

        if (assistantTeachers.length !== createClassDto.assistantTeacherIds.length) {
          throw new NotFoundException(`One or more assistant teachers not found`);
        }

        classEntity.assistantTeachers = assistantTeachers;
      }

      return this.classRepository.save(classEntity);
    } catch (error) {
      this.logger.error(`Failed to create class: ${error.message}`);
      throw error;
    }
  }

  async findAllClasses(filterDto: ClassFilterDto): Promise<Class[]> {
    try {
      const { 
        search, 
        courseId, 
        termId, 
        type, 
        primaryTeacherId, 
        isActive,
        studentId,
        assistantTeacherId
      } = filterDto;
      
      const queryBuilder = this.classRepository.createQueryBuilder('class')
        .leftJoinAndSelect('class.course', 'course')
        .leftJoinAndSelect('class.term', 'term')
        .leftJoinAndSelect('class.primaryTeacher', 'primaryTeacher')
        .leftJoinAndSelect('class.schedules', 'schedules');

      // Apply search filter
      if (search) {
        queryBuilder.andWhere(
          '(class.name ILIKE :search OR class.code ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Apply other filters
      if (courseId) {
        queryBuilder.andWhere('class.courseId = :courseId', { courseId });
      }

      if (termId) {
        queryBuilder.andWhere('class.termId = :termId', { termId });
      }

      if (type) {
        queryBuilder.andWhere('class.type = :type', { type });
      }

      if (primaryTeacherId) {
        queryBuilder.andWhere('class.primaryTeacherId = :primaryTeacherId', { primaryTeacherId });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('class.isActive = :isActive', { isActive });
      }

      // Filter by student enrollment
      if (studentId) {
        queryBuilder
          .leftJoin('class.students', 'students')
          .andWhere('students.id = :studentId', { studentId });
      }

      // Filter by assistant teacher
      if (assistantTeacherId) {
        queryBuilder
          .leftJoin('class.assistantTeachers', 'assistantTeachers')
          .andWhere('assistantTeachers.id = :assistantTeacherId', { assistantTeacherId });
      }

      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find classes: ${error.message}`);
      throw error;
    }
  }

  async findClassById(id: string): Promise<Class> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { id },
        relations: [
          'course', 
          'term', 
          'primaryTeacher', 
          'schedules', 
          'students', 
          'assistantTeachers'
        ],
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${id} not found`);
      }

      return classEntity;
    } catch (error) {
      this.logger.error(`Failed to find class: ${error.message}`);
      throw error;
    }
  }

  async findClassByCode(code: string): Promise<Class> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { code },
        relations: [
          'course', 
          'term', 
          'primaryTeacher', 
          'schedules', 
          'students', 
          'assistantTeachers'
        ],
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with code ${code} not found`);
      }

      return classEntity;
    } catch (error) {
      this.logger.error(`Failed to find class by code: ${error.message}`);
      throw error;
    }
  }

  async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    try {
      const classEntity = await this.findClassById(id);

      // Check if code is being updated and already exists
      if (updateClassDto.code && updateClassDto.code !== classEntity.code) {
        const existingClass = await this.classRepository.findOne({
          where: { code: updateClassDto.code },
        });

        if (existingClass && existingClass.id !== id) {
          throw new ConflictException(`Class with code ${updateClassDto.code} already exists`);
        }
      }

      // Check if course exists if being updated
      if (updateClassDto.courseId) {
        const course = await this.courseRepository.findOne({
          where: { id: updateClassDto.courseId },
        });

        if (!course) {
          throw new NotFoundException(`Course with ID ${updateClassDto.courseId} not found`);
        }
      }

      // Check if term exists if being updated
      if (updateClassDto.termId) {
        const term = await this.termRepository.findOne({
          where: { id: updateClassDto.termId },
        });

        if (!term) {
          throw new NotFoundException(`Term with ID ${updateClassDto.termId} not found`);
        }
      }

      // Check if primary teacher exists if being updated
      if (updateClassDto.primaryTeacherId) {
        const teacher = await this.userRepository.findOne({
          where: { id: updateClassDto.primaryTeacherId },
        });

        if (!teacher) {
          throw new NotFoundException(`Teacher with ID ${updateClassDto.primaryTeacherId} not found`);
        }
      }

      // Handle assistant teachers if provided
      if (updateClassDto.assistantTeacherIds && updateClassDto.assistantTeacherIds.length > 0) {
        const assistantTeachers = await this.userRepository.find({
          where: { id: In(updateClassDto.assistantTeacherIds) },
        });

        if (assistantTeachers.length !== updateClassDto.assistantTeacherIds.length) {
          throw new NotFoundException(`One or more assistant teachers not found`);
        }

        classEntity.assistantTeachers = assistantTeachers;
      }

      // Remove assistantTeacherIds from DTO as it's not a direct property of the class entity
      const { assistantTeacherIds, ...classUpdateData } = updateClassDto;

      // Update class
      const updatedClass = await this.classRepository.save({
        ...classEntity,
        ...classUpdateData,
      });

      return this.findClassById(updatedClass.id);
    } catch (error) {
      this.logger.error(`Failed to update class: ${error.message}`);
      throw error;
    }
  }

  async removeClass(id: string): Promise<Class> {
    try {
      const classEntity = await this.findClassById(id);

      // Check if class has students
      if (classEntity.students && classEntity.students.length > 0) {
        throw new BadRequestException(`Cannot delete class with enrolled students`);
      }

      return this.classRepository.remove(classEntity);
    } catch (error) {
      this.logger.error(`Failed to remove class: ${error.message}`);
      throw error;
    }
  }

  /**
   * Class Schedule Management
   */
  async createClassSchedule(createClassScheduleDto: CreateClassScheduleDto): Promise<ClassSchedule> {
    try {
      // Check if class exists
      const classEntity = await this.classRepository.findOne({
        where: { id: createClassScheduleDto.classId },
        relations: ['schedules'],
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${createClassScheduleDto.classId} not found`);
      }

      // Check for schedule conflicts
      await this.checkScheduleConflicts(createClassScheduleDto);

      // Create schedule
      const schedule = this.scheduleRepository.create(createClassScheduleDto);
      return this.scheduleRepository.save(schedule);
    } catch (error) {
      this.logger.error(`Failed to create class schedule: ${error.message}`);
      throw error;
    }
  }

  async findScheduleById(id: string): Promise<ClassSchedule> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id },
        relations: ['class'],
      });

      if (!schedule) {
        throw new NotFoundException(`Schedule with ID ${id} not found`);
      }

      return schedule;
    } catch (error) {
      this.logger.error(`Failed to find schedule: ${error.message}`);
      throw error;
    }
  }

  async findSchedulesByClassId(classId: string): Promise<ClassSchedule[]> {
    try {
      return this.scheduleRepository.find({
        where: { classId },
        order: { dayOfWeek: 'ASC', startTime: 'ASC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find schedules for class: ${error.message}`);
      throw error;
    }
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateClassScheduleDto): Promise<ClassSchedule> {
    try {
      const schedule = await this.findScheduleById(id);

      // Check for schedule conflicts if time or day is being updated
      if (updateScheduleDto.dayOfWeek || updateScheduleDto.startTime || updateScheduleDto.endTime) {
        await this.checkScheduleConflicts({
          classId: schedule.classId,
          dayOfWeek: updateScheduleDto.dayOfWeek || schedule.dayOfWeek,
          startTime: updateScheduleDto.startTime || schedule.startTime,
          endTime: updateScheduleDto.endTime || schedule.endTime,
          isRecurring: updateScheduleDto.isRecurring !== undefined ? updateScheduleDto.isRecurring : schedule.isRecurring,
          specificDate: updateScheduleDto.specificDate || schedule.specificDate,
        }, id);
      }

      // Update schedule
      const updatedSchedule = await this.scheduleRepository.save({
        ...schedule,
        ...updateScheduleDto,
      });

      return updatedSchedule;
    } catch (error) {
      this.logger.error(`Failed to update schedule: ${error.message}`);
      throw error;
    }
  }

  async removeSchedule(id: string): Promise<ClassSchedule> {
    try {
      const schedule = await this.findScheduleById(id);
      return this.scheduleRepository.remove(schedule);
    } catch (error) {
      this.logger.error(`Failed to remove schedule: ${error.message}`);
      throw error;
    }
  }

  /**
   * Student Enrollment Management
   */
  async enrollStudents(classId: string, enrollStudentsDto: EnrollStudentsDto): Promise<Class> {
    try {
      const classEntity = await this.findClassById(classId);
      
      // Check if class is at capacity
      if (classEntity.enrollmentCount >= classEntity.capacity) {
        throw new BadRequestException(`Class is at maximum capacity`);
      }

      // Check if students exist
      const students = await this.studentRepository.find({
        where: { id: In(enrollStudentsDto.studentIds) },
      });

      if (students.length !== enrollStudentsDto.studentIds.length) {
        throw new NotFoundException(`One or more students not found`);
      }

      // Get currently enrolled students
      const currentStudentIds = classEntity.students.map(student => student.id);
      
      // Filter out students who are already enrolled
      const newStudents = students.filter(student => !currentStudentIds.includes(student.id));
      
      if (newStudents.length === 0) {
        throw new BadRequestException(`All students are already enrolled in this class`);
      }

      // Check if adding these students would exceed capacity
      if (classEntity.enrollmentCount + newStudents.length > classEntity.capacity) {
        throw new BadRequestException(`Enrolling these students would exceed class capacity`);
      }

      // Add new students to class
      classEntity.students = [...classEntity.students, ...newStudents];
      classEntity.enrollmentCount += newStudents.length;
      
      // Save updated class
      const updatedClass = await this.classRepository.save(classEntity);
      
      // Send enrollment notifications
      await this.sendEnrollmentNotifications(updatedClass, newStudents);
      
      return this.findClassById(updatedClass.id);
    } catch (error) {
      this.logger.error(`Failed to enroll students: ${error.message}`);
      throw error;
    }
  }

  async unenrollStudent(classId: string, studentId: string): Promise<Class> {
    try {
      const classEntity = await this.findClassById(classId);
      
      // Check if student is enrolled
      const studentIndex = classEntity.students.findIndex(student => student.id === studentId);
      
      if (studentIndex === -1) {
        throw new BadRequestException(`Student is not enrolled in this class`);
      }

      // Remove student from class
      classEntity.students.splice(studentIndex, 1);
      classEntity.enrollmentCount -= 1;
      
      // Save updated class
      const updatedClass = await this.classRepository.save(classEntity);
      
      return this.findClassById(updatedClass.id);
    } catch (error) {
      this.logger.error(`Failed to unenroll student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper Methods
   */
  private async checkScheduleConflicts(
    scheduleDto: Partial<CreateClassScheduleDto> & { classId: string },
    excludeScheduleId?: string,
  ): Promise<void> {
    // Get the class and its room/building
    const classEntity = await this.classRepository.findOne({
      where: { id: scheduleDto.classId },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${scheduleDto.classId} not found`);
    }

    // Determine room and building (from schedule or class)
    const room = scheduleDto.room || classEntity.room;
    const building = scheduleDto.building || classEntity.building;

    // If no room/building specified, no need to check for conflicts
    if (!room || !building) {
      return;
    }

    // Find schedules that might conflict
    const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.class', 'class')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek: scheduleDto.dayOfWeek });

    // For non-recurring schedules, check specific date
    if (!scheduleDto.isRecurring && scheduleDto.specificDate) {
      queryBuilder.andWhere('schedule.specificDate = :specificDate', { specificDate: scheduleDto.specificDate });
    }

    // Time overlap condition
    queryBuilder.andWhere(
      '(schedule.startTime < :endTime AND schedule.endTime > :startTime)',
      { startTime: scheduleDto.startTime, endTime: scheduleDto.endTime }
    );

    // Room/building condition
    queryBuilder.andWhere(
      '((schedule.room = :room OR class.room = :room) AND (schedule.building = :building OR class.building = :building))',
      { room, building }
    );

    // Exclude the current schedule if updating
    if (excludeScheduleId) {
      queryBuilder.andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId });
    }

    const conflictingSchedules = await queryBuilder.getMany();

    if (conflictingSchedules.length > 0) {
      throw new ConflictException(`Schedule conflicts with existing class in the same room/building`);
    }
  }

  private async sendEnrollmentNotifications(classEntity: Class, students: Student[]): Promise<void> {
    try {
      const schoolName = this.configService.get<string>('SCHOOL_NAME');
      const portalUrl = this.configService.get<string>('STUDENT_PORTAL_URL');
      
      for (const student of students) {
        // Send email to student if email is provided
        if (student.email) {
          await this.notificationService.sendEmail({
            to: student.email,
            subject: `Class Enrollment: ${classEntity.course.name}`,
            templateName: 'class-enrollment',
            context: {
              studentName: `${student.firstName} ${student.lastName}`,
              className: classEntity.name,
              courseName: classEntity.course.name,
              courseCode: classEntity.course.code,
              termName: classEntity.term.name,
              schedules: classEntity.schedules,
              schoolName,
              portalUrl,
            },
          });
        }
        
        // Send notifications to guardians
        if (student.guardians && student.guardians.length > 0) {
          for (const guardian of student.guardians) {
            // Send email to guardian if email is provided
            if (guardian.email) {
              await this.notificationService.sendEmail({
                to: guardian.email,
                subject: `Your Child's Class Enrollment: ${classEntity.course.name}`,
                templateName: 'guardian-class-enrollment',
                context: {
                  guardianName: guardian.name,
                  studentName: `${student.firstName} ${student.lastName}`,
                  className: classEntity.name,
                  courseName: classEntity.course.name,
                  courseCode: classEntity.course.code,
                  termName: classEntity.term.name,
                  schedules: classEntity.schedules,
                  schoolName,
                  portalUrl,
                },
              });
            }
          }
        }
      }
      
      this.logger.log(`Enrollment notifications sent for class ${classEntity.id}`);
    } catch (error) {
      this.logger.error(`Failed to send enrollment notifications: ${error.message}`);
      // Don't throw the error to prevent the main operation from failing
    }
  }
}

