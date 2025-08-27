import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, In, IsNull, Not } from 'typeorm';
import { Student, StudentStatus } from './entities/student.entity';
import { CreateStudentDto, UpdateStudentDto, StudentFilterDto } from './dto';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findAll(filterDto: StudentFilterDto) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
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
      includeInactive = false
    } = filterDto;

    const skip = (page - 1) * limit;
    
    const whereClause: FindOptionsWhere<Student> = {};
    
    // Apply filters
    if (name) {
      whereClause.firstName = Like(`%${name}%`);
      // TODO: Add OR conditions for middle and last name
    }
    
    if (admissionNumber) {
      whereClause.admissionNumber = Like(`%${admissionNumber}%`);
    }
    
    if (classId) {
      whereClause.currentClassId = classId;
    }
    
    if (sectionId) {
      whereClause.currentSectionId = sectionId;
    }
    
    if (academicYearId) {
      whereClause.academicYearId = academicYearId;
    }
    
    if (gender) {
      whereClause.gender = gender;
    }
    
    if (status) {
      whereClause.status = status;
    } else if (!includeInactive) {
      // By default, only show active students
      whereClause.status = StudentStatus.ACTIVE;
    }
    
    if (admissionDateFrom && admissionDateTo) {
      whereClause.admissionDate = Between(
        new Date(admissionDateFrom), 
        new Date(admissionDateTo)
      );
    } else if (admissionDateFrom) {
      whereClause.admissionDate = Between(
        new Date(admissionDateFrom), 
        new Date()
      );
    }
    
    if (dateOfBirthFrom && dateOfBirthTo) {
      whereClause.dateOfBirth = Between(
        new Date(dateOfBirthFrom), 
        new Date(dateOfBirthTo)
      );
    }
    
    if (nationality) {
      whereClause.nationality = nationality;
    }
    
    if (religion) {
      whereClause.religion = religion;
    }
    
    if (house) {
      whereClause.house = house;
    }
    
    if (busRouteNumber) {
      whereClause.busRouteNumber = busRouteNumber;
    }
    
    if (hostelRoomNumber) {
      whereClause.hostelRoomNumber = hostelRoomNumber;
    }
    
    if (feeCategory) {
      whereClause.feeCategory = feeCategory;
    }

    const [students, total] = await this.studentsRepository.findAndCount({
      where: whereClause,
      relations: ['user', 'currentClass', 'currentSection', 'academicYear'],
      skip,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['user', 'currentClass', 'currentSection', 'academicYear'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    
    return student;
  }

  async findByAdmissionNumber(admissionNumber: string) {
    const student = await this.studentsRepository.findOne({
      where: { admissionNumber },
      relations: ['user', 'currentClass', 'currentSection', 'academicYear'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with admission number ${admissionNumber} not found`);
    }
    
    return student;
  }

  async create(dto: CreateStudentDto, currentUserId?: string) {
    // Check if admission number already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { admissionNumber: dto.admissionNumber },
    });
    
    if (existingStudent) {
      throw new ConflictException(`Student with admission number ${dto.admissionNumber} already exists`);
    }

    // Create user account if requested
    let user: User | undefined;
    if (dto.createUserAccount) {
      // Generate a temporary password
      const tempPassword = randomBytes(8).toString('hex');
      
      // Create user with student role
      user = this.usersRepository.create({
        email: dto.email || `${dto.admissionNumber}@${this.configService.get('SCHOOL_EMAIL_DOMAIN', 'school.edu')}`,
        fullName: `${dto.firstName} ${dto.middleName ? dto.middleName + ' ' : ''}${dto.lastName}`,
        password: tempPassword, // This will be hashed by the entity's BeforeInsert hook
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        phoneNumber: dto.phoneNumber,
        profilePicture: dto.profilePicture,
        createdBy: currentUserId,
      });
      
      try {
        user = await this.usersRepository.save(user);
        this.logger.log(`Created user account for student ${dto.admissionNumber}`);
        
        // TODO: Send email with temporary password
      } catch (error) {
        this.logger.error(`Failed to create user account for student: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to create user account for student');
      }
    }

    // Create student entity
    const student = this.studentsRepository.create({
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
      admissionDate: new Date(dto.admissionDate),
      graduationDate: dto.graduationDate ? new Date(dto.graduationDate) : undefined,
      userId: user?.id,
      createdBy: currentUserId,
    });
    
    try {
      const savedStudent = await this.studentsRepository.save(student);
      this.logger.log(`Created student with ID ${savedStudent.id}`);
      
      // Return student with user relation
      if (user) {
        savedStudent.user = user;
      }
      
      return savedStudent;
    } catch (error) {
      // If user was created but student creation failed, delete the user
      if (user) {
        await this.usersRepository.delete(user.id);
      }
      
      this.logger.error(`Failed to create student: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create student');
    }
  }

  async update(id: string, dto: UpdateStudentDto, currentUserId?: string) {
    const student = await this.studentsRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Handle date conversions
    if (dto.dateOfBirth) {
      dto.dateOfBirth = new Date(dto.dateOfBirth) as any;
    }
    
    if (dto.admissionDate) {
      dto.admissionDate = new Date(dto.admissionDate) as any;
    }
    
    if (dto.graduationDate) {
      dto.graduationDate = new Date(dto.graduationDate) as any;
    }

    // Update user information if it exists
    if (student.user && (dto.email || dto.phoneNumber || dto.profilePicture)) {
      const userUpdates: Partial<User> = {
        updatedBy: currentUserId,
      };
      
      if (dto.email) {
        userUpdates.email = dto.email;
      }
      
      if (dto.phoneNumber) {
        userUpdates.phoneNumber = dto.phoneNumber;
      }
      
      if (dto.profilePicture) {
        userUpdates.profilePicture = dto.profilePicture;
      }
      
      // Update user's full name if first or last name changed
      if (dto.firstName || dto.lastName) {
        userUpdates.fullName = `${dto.firstName || student.firstName} ${student.middleName ? (dto.middleName || student.middleName) + ' ' : ''}${dto.lastName || student.lastName}`;
      }
      
      await this.usersRepository.update(student.user.id, userUpdates);
    }

    // Update student
    Object.assign(student, {
      ...dto,
      updatedBy: currentUserId,
    });
    
    try {
      const updatedStudent = await this.studentsRepository.save(student);
      this.logger.log(`Updated student with ID ${id}`);
      return updatedStudent;
    } catch (error) {
      this.logger.error(`Failed to update student: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update student');
    }
  }

  async remove(id: string, currentUserId?: string) {
    const student = await this.studentsRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Soft delete the student
    student.deletedBy = currentUserId;
    await this.studentsRepository.softRemove(student);
    
    // If there's an associated user, soft delete it too
    if (student.user) {
      student.user.deletedBy = currentUserId;
      await this.usersRepository.softRemove(student.user);
    }
    
    this.logger.log(`Deleted student with ID ${id}`);
    return { id, deleted: true };
  }

  async bulkCreate(dtos: CreateStudentDto[], currentUserId?: string) {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const dto of dtos) {
      try {
        await this.create(dto, currentUserId);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          admissionNumber: dto.admissionNumber,
          error: error.message,
        });
      }
    }

    return results;
  }

  async bulkUpdate(ids: string[], dto: UpdateStudentDto, currentUserId?: string) {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const id of ids) {
      try {
        await this.update(id, dto, currentUserId);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          id,
          error: error.message,
        });
      }
    }

    return results;
  }

  async getStudentsByClass(classId: string) {
    return this.studentsRepository.find({
      where: { 
        currentClassId: classId,
        status: StudentStatus.ACTIVE,
      },
      relations: ['user'],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  async getStudentsBySection(sectionId: string) {
    return this.studentsRepository.find({
      where: { 
        currentSectionId: sectionId,
        status: StudentStatus.ACTIVE,
      },
      relations: ['user'],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  async getStudentsByAcademicYear(academicYearId: string) {
    return this.studentsRepository.find({
      where: { 
        academicYearId: academicYearId,
        status: StudentStatus.ACTIVE,
      },
      relations: ['user', 'currentClass', 'currentSection'],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  async promoteStudents(
    studentIds: string[], 
    targetClassId: string, 
    targetSectionId: string, 
    targetAcademicYearId: string,
    currentUserId?: string
  ) {
    const students = await this.studentsRepository.find({
      where: { id: In(studentIds) },
    });
    
    if (students.length !== studentIds.length) {
      throw new BadRequestException('Some student IDs are invalid');
    }
    
    const updatedStudents = [];
    
    for (const student of students) {
      student.currentClassId = targetClassId;
      student.currentSectionId = targetSectionId;
      student.academicYearId = targetAcademicYearId;
      student.updatedBy = currentUserId;
      
      updatedStudents.push(await this.studentsRepository.save(student));
    }
    
    return {
      count: updatedStudents.length,
      message: `Successfully promoted ${updatedStudents.length} students`,
    };
  }

  async graduateStudents(
    studentIds: string[], 
    graduationDate: Date,
    currentUserId?: string
  ) {
    const students = await this.studentsRepository.find({
      where: { id: In(studentIds) },
    });
    
    if (students.length !== studentIds.length) {
      throw new BadRequestException('Some student IDs are invalid');
    }
    
    const updatedStudents = [];
    
    for (const student of students) {
      student.status = StudentStatus.GRADUATED;
      student.graduationDate = graduationDate;
      student.updatedBy = currentUserId;
      
      updatedStudents.push(await this.studentsRepository.save(student));
    }
    
    return {
      count: updatedStudents.length,
      message: `Successfully graduated ${updatedStudents.length} students`,
    };
  }

  async getStudentStats() {
    const totalStudents = await this.studentsRepository.count();
    
    const activeStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.ACTIVE },
    });
    
    const inactiveStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.INACTIVE },
    });
    
    const graduatedStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.GRADUATED },
    });
    
    const transferredStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.TRANSFERRED },
    });
    
    const suspendedStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.SUSPENDED },
    });
    
    const expelledStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.EXPELLED },
    });
    
    const alumniStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.ALUMNI },
    });
    
    const pendingStudents = await this.studentsRepository.count({
      where: { status: StudentStatus.PENDING },
    });
    
    const studentsWithoutClass = await this.studentsRepository.count({
      where: { 
        currentClassId: IsNull(),
        status: StudentStatus.ACTIVE,
      },
    });
    
    const studentsWithoutSection = await this.studentsRepository.count({
      where: { 
        currentSectionId: IsNull(),
        currentClassId: Not(IsNull()),
        status: StudentStatus.ACTIVE,
      },
    });
    
    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
      transferredStudents,
      suspendedStudents,
      expelledStudents,
      alumniStudents,
      pendingStudents,
      studentsWithoutClass,
      studentsWithoutSection,
    };
  }
}

