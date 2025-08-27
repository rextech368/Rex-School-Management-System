import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Student } from '../entities/student.entity';
import { Guardian } from '../entities/guardian.entity';
import { StudentDocument } from '../entities/student-document.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { CreateGuardianDto } from '../dto/create-guardian.dto';
import { UpdateGuardianDto } from '../dto/update-guardian.dto';
import { CreateStudentDocumentDto } from '../dto/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/update-student-document.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Guardian)
    private guardianRepository: Repository<Guardian>,
    @InjectRepository(StudentDocument)
    private studentDocumentRepository: Repository<StudentDocument>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a new student with optional guardians
   */
  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      // Check if student ID already exists
      const existingStudent = await this.studentRepository.findOne({
        where: { studentId: createStudentDto.studentId },
      });

      if (existingStudent) {
        throw new BadRequestException(`Student with ID ${createStudentDto.studentId} already exists`);
      }

      // Check if email already exists (if provided)
      if (createStudentDto.email) {
        const existingEmail = await this.studentRepository.findOne({
          where: { email: createStudentDto.email },
        });

        if (existingEmail) {
          throw new BadRequestException(`Student with email ${createStudentDto.email} already exists`);
        }
      }

      // Create student
      const student = this.studentRepository.create(createStudentDto);
      
      // Handle guardians if provided
      if (createStudentDto.guardians && createStudentDto.guardians.length > 0) {
        const guardians = [];
        
        for (const guardianDto of createStudentDto.guardians) {
          const guardian = this.guardianRepository.create(guardianDto);
          guardians.push(await this.guardianRepository.save(guardian));
        }
        
        student.guardians = guardians;
      } else {
        student.guardians = [];
      }
      
      // Save student with guardians
      const savedStudent = await this.studentRepository.save(student);
      
      // Send welcome notification if enabled
      if (this.configService.get<boolean>('STUDENT_WELCOME_NOTIFICATION_ENABLED')) {
        await this.sendStudentWelcomeNotification(savedStudent);
      }
      
      return savedStudent;
    } catch (error) {
      this.logger.error(`Failed to create student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all students with optional filtering
   */
  async findAllStudents(filterDto: StudentFilterDto): Promise<Student[]> {
    try {
      const {
        search,
        gradeLevel,
        classId,
        gender,
        status,
        enrollmentDateStart,
        enrollmentDateEnd,
        dateOfBirthStart,
        dateOfBirthEnd,
        nationality,
        city,
        state,
        country,
      } = filterDto;
      
      const queryBuilder = this.studentRepository.createQueryBuilder('student')
        .leftJoinAndSelect('student.guardians', 'guardian');
      
      // Apply search filter
      if (search) {
        queryBuilder.andWhere(
          '(student.firstName ILIKE :search OR student.lastName ILIKE :search OR student.email ILIKE :search OR student.studentId ILIKE :search)',
          { search: `%${search}%` }
        );
      }
      
      // Apply other filters
      if (gradeLevel) {
        queryBuilder.andWhere('student.gradeLevel = :gradeLevel', { gradeLevel });
      }
      
      if (classId) {
        queryBuilder.andWhere('student.classId = :classId', { classId });
      }
      
      if (gender) {
        queryBuilder.andWhere('student.gender = :gender', { gender });
      }
      
      if (status) {
        queryBuilder.andWhere('student.status = :status', { status });
      }
      
      if (enrollmentDateStart && enrollmentDateEnd) {
        queryBuilder.andWhere('student.enrollmentDate BETWEEN :enrollmentDateStart AND :enrollmentDateEnd', {
          enrollmentDateStart,
          enrollmentDateEnd,
        });
      } else if (enrollmentDateStart) {
        queryBuilder.andWhere('student.enrollmentDate >= :enrollmentDateStart', { enrollmentDateStart });
      } else if (enrollmentDateEnd) {
        queryBuilder.andWhere('student.enrollmentDate <= :enrollmentDateEnd', { enrollmentDateEnd });
      }
      
      if (dateOfBirthStart && dateOfBirthEnd) {
        queryBuilder.andWhere('student.dateOfBirth BETWEEN :dateOfBirthStart AND :dateOfBirthEnd', {
          dateOfBirthStart,
          dateOfBirthEnd,
        });
      } else if (dateOfBirthStart) {
        queryBuilder.andWhere('student.dateOfBirth >= :dateOfBirthStart', { dateOfBirthStart });
      } else if (dateOfBirthEnd) {
        queryBuilder.andWhere('student.dateOfBirth <= :dateOfBirthEnd', { dateOfBirthEnd });
      }
      
      if (nationality) {
        queryBuilder.andWhere('student.nationality = :nationality', { nationality });
      }
      
      if (city) {
        queryBuilder.andWhere('student.city = :city', { city });
      }
      
      if (state) {
        queryBuilder.andWhere('student.state = :state', { state });
      }
      
      if (country) {
        queryBuilder.andWhere('student.country = :country', { country });
      }
      
      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find students: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find student by ID
   */
  async findStudentById(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['guardians'],
      });
      
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      
      return student;
    } catch (error) {
      this.logger.error(`Failed to find student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find student by student ID (school-specific ID)
   */
  async findStudentByStudentId(studentId: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { studentId },
        relations: ['guardians'],
      });
      
      if (!student) {
        throw new NotFoundException(`Student with student ID ${studentId} not found`);
      }
      
      return student;
    } catch (error) {
      this.logger.error(`Failed to find student by student ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update student
   */
  async updateStudent(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.findStudentById(id);
      
      // Check if email is being updated and already exists
      if (updateStudentDto.email && updateStudentDto.email !== student.email) {
        const existingEmail = await this.studentRepository.findOne({
          where: { email: updateStudentDto.email },
        });

        if (existingEmail && existingEmail.id !== id) {
          throw new BadRequestException(`Student with email ${updateStudentDto.email} already exists`);
        }
      }
      
      // Update student
      const updatedStudent = await this.studentRepository.save({
        ...student,
        ...updateStudentDto,
      });
      
      return updatedStudent;
    } catch (error) {
      this.logger.error(`Failed to update student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete student
   */
  async removeStudent(id: string): Promise<Student> {
    try {
      const student = await this.findStudentById(id);
      return this.studentRepository.remove(student);
    } catch (error) {
      this.logger.error(`Failed to remove student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add guardian to student
   */
  async addGuardianToStudent(studentId: string, createGuardianDto: CreateGuardianDto): Promise<Guardian> {
    try {
      const student = await this.findStudentById(studentId);
      
      // Create guardian
      const guardian = this.guardianRepository.create(createGuardianDto);
      const savedGuardian = await this.guardianRepository.save(guardian);
      
      // Add guardian to student
      if (!student.guardians) {
        student.guardians = [];
      }
      
      student.guardians.push(savedGuardian);
      await this.studentRepository.save(student);
      
      return savedGuardian;
    } catch (error) {
      this.logger.error(`Failed to add guardian to student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find guardian by ID
   */
  async findGuardianById(id: string): Promise<Guardian> {
    try {
      const guardian = await this.guardianRepository.findOne({
        where: { id },
        relations: ['students'],
      });
      
      if (!guardian) {
        throw new NotFoundException(`Guardian with ID ${id} not found`);
      }
      
      return guardian;
    } catch (error) {
      this.logger.error(`Failed to find guardian: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update guardian
   */
  async updateGuardian(id: string, updateGuardianDto: UpdateGuardianDto): Promise<Guardian> {
    try {
      const guardian = await this.findGuardianById(id);
      
      // Update guardian
      const updatedGuardian = await this.guardianRepository.save({
        ...guardian,
        ...updateGuardianDto,
      });
      
      return updatedGuardian;
    } catch (error) {
      this.logger.error(`Failed to update guardian: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove guardian
   */
  async removeGuardian(id: string): Promise<Guardian> {
    try {
      const guardian = await this.findGuardianById(id);
      return this.guardianRepository.remove(guardian);
    } catch (error) {
      this.logger.error(`Failed to remove guardian: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove guardian from student
   */
  async removeGuardianFromStudent(studentId: string, guardianId: string): Promise<Student> {
    try {
      const student = await this.findStudentById(studentId);
      const guardian = await this.findGuardianById(guardianId);
      
      // Check if guardian is associated with student
      const guardianIndex = student.guardians.findIndex(g => g.id === guardianId);
      
      if (guardianIndex === -1) {
        throw new BadRequestException(`Guardian with ID ${guardianId} is not associated with student ${studentId}`);
      }
      
      // Remove guardian from student
      student.guardians.splice(guardianIndex, 1);
      await this.studentRepository.save(student);
      
      // If guardian has no other students, remove guardian
      if (guardian.students.length <= 1) {
        await this.guardianRepository.remove(guardian);
      }
      
      return student;
    } catch (error) {
      this.logger.error(`Failed to remove guardian from student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add document to student
   */
  async addDocumentToStudent(createStudentDocumentDto: CreateStudentDocumentDto): Promise<StudentDocument> {
    try {
      // Check if student exists
      const student = await this.studentRepository.findOne({
        where: { id: createStudentDocumentDto.studentId },
      });
      
      if (!student) {
        throw new NotFoundException(`Student with ID ${createStudentDocumentDto.studentId} not found`);
      }
      
      // Create document
      const document = this.studentDocumentRepository.create(createStudentDocumentDto);
      return this.studentDocumentRepository.save(document);
    } catch (error) {
      this.logger.error(`Failed to add document to student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find document by ID
   */
  async findDocumentById(id: string): Promise<StudentDocument> {
    try {
      const document = await this.studentDocumentRepository.findOne({
        where: { id },
        relations: ['student'],
      });
      
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
      
      return document;
    } catch (error) {
      this.logger.error(`Failed to find document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all documents for a student
   */
  async findAllDocumentsForStudent(studentId: string): Promise<StudentDocument[]> {
    try {
      // Check if student exists
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
      
      // Find documents
      return this.studentDocumentRepository.find({
        where: { studentId },
        order: { uploadDate: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find documents for student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update document
   */
  async updateDocument(id: string, updateStudentDocumentDto: UpdateStudentDocumentDto): Promise<StudentDocument> {
    try {
      const document = await this.findDocumentById(id);
      
      // Update document
      const updatedDocument = await this.studentDocumentRepository.save({
        ...document,
        ...updateStudentDocumentDto,
      });
      
      return updatedDocument;
    } catch (error) {
      this.logger.error(`Failed to update document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove document
   */
  async removeDocument(id: string): Promise<StudentDocument> {
    try {
      const document = await this.findDocumentById(id);
      return this.studentDocumentRepository.remove(document);
    } catch (error) {
      this.logger.error(`Failed to remove document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send welcome notification to student and guardians
   */
  private async sendStudentWelcomeNotification(student: Student): Promise<void> {
    try {
      const schoolName = this.configService.get<string>('SCHOOL_NAME');
      const portalUrl = this.configService.get<string>('STUDENT_PORTAL_URL');
      
      // Send email to student if email is provided
      if (student.email) {
        await this.notificationService.sendEmail({
          to: student.email,
          subject: `Welcome to ${schoolName}`,
          templateName: 'student-welcome',
          context: {
            studentName: `${student.firstName} ${student.lastName}`,
            studentId: student.studentId,
            gradeLevel: student.gradeLevel,
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
              subject: `Your Child Has Been Enrolled at ${schoolName}`,
              templateName: 'guardian-welcome',
              context: {
                guardianName: guardian.name,
                studentName: `${student.firstName} ${student.lastName}`,
                studentId: student.studentId,
                gradeLevel: student.gradeLevel,
                schoolName,
                portalUrl,
              },
            });
          }
          
          // Send SMS to guardian
          if (guardian.phoneNumber) {
            await this.notificationService.sendSms({
              to: guardian.phoneNumber,
              templateName: 'guardian-welcome',
              context: {
                guardianName: guardian.name,
                studentName: `${student.firstName} ${student.lastName}`,
                studentId: student.studentId,
                schoolName,
              },
            });
          }
        }
      }
      
      this.logger.log(`Welcome notification sent for student ${student.id}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome notification: ${error.message}`);
      // Don't throw the error to prevent the main operation from failing
    }
  }
}

