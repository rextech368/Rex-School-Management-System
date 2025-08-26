import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Parent } from '../entities/parent.entity';
import { UsersService } from '../../users/services/users.service';
import { User, UserRole, UserStatus } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StudentAccountService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a user account for a student
   * @param studentId The ID of the student
   * @param options Options for account creation
   * @returns The created user
   */
  async createStudentAccount(
    studentId: string,
    options: {
      generatePassword?: boolean;
      sendWelcomeEmail?: boolean;
      initialStatus?: UserStatus;
    } = {},
  ): Promise<User> {
    const {
      generatePassword = true,
      sendWelcomeEmail = true,
      initialStatus = UserStatus.PENDING,
    } = options;

    // Find the student
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Check if student already has a user account
    if (student.userId) {
      const existingUser = await this.usersRepository.findOneBy({ id: student.userId });
      if (existingUser) {
        throw new BadRequestException(`Student already has a user account`);
      }
    }

    // Generate email if not provided
    const email = student.email || this.generateStudentEmail(student);

    // Create user account
    const user = await this.usersService.create(
      {
        email,
        fullName: `${student.firstName} ${student.lastName}`,
        password: '', // Will be generated if generatePassword is true
        role: UserRole.STUDENT,
        status: initialStatus,
        phoneNumber: student.phoneNumber,
        generateRandomPassword: generatePassword,
        sendWelcomeEmail,
      },
      student.createdBy,
    );

    // Update student with user ID
    await this.studentsRepository.update(studentId, { userId: user.id });

    return user;
  }

  /**
   * Create a user account for a parent
   * @param parentId The ID of the parent
   * @param options Options for account creation
   * @returns The created user
   */
  async createParentAccount(
    parentId: string,
    options: {
      generatePassword?: boolean;
      sendWelcomeEmail?: boolean;
      initialStatus?: UserStatus;
    } = {},
  ): Promise<User> {
    const {
      generatePassword = true,
      sendWelcomeEmail = true,
      initialStatus = UserStatus.PENDING,
    } = options;

    // Find the parent
    const parent = await this.parentsRepository.findOne({
      where: { id: parentId },
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }

    // Check if parent already has a user account
    if (parent.userId) {
      const existingUser = await this.usersRepository.findOneBy({ id: parent.userId });
      if (existingUser) {
        throw new BadRequestException(`Parent already has a user account`);
      }
    }

    // Create user account
    const user = await this.usersService.create(
      {
        email: parent.email,
        fullName: `${parent.firstName} ${parent.lastName}`,
        password: '', // Will be generated if generatePassword is true
        role: UserRole.PARENT,
        status: initialStatus,
        phoneNumber: parent.phoneNumber,
        generateRandomPassword: generatePassword,
        sendWelcomeEmail,
      },
      parent.createdBy,
    );

    // Update parent with user ID
    await this.parentsRepository.update(parentId, { userId: user.id });

    return user;
  }

  /**
   * Generate a student email based on school domain and student information
   * @param student The student entity
   * @returns Generated email
   */
  private generateStudentEmail(student: Student): string {
    const schoolDomain = this.configService.get<string>('SCHOOL_EMAIL_DOMAIN') || 'school.example.com';
    const admissionNumber = student.admissionNumber.toLowerCase().replace(/\s/g, '');
    
    return `${admissionNumber}@${schoolDomain}`;
  }

  /**
   * Link an existing user account to a student
   * @param studentId The ID of the student
   * @param userId The ID of the user
   * @returns The updated student
   */
  async linkStudentToUser(studentId: string, userId: string): Promise<Student> {
    // Find the student
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Find the user
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user is already linked to another student
    const existingStudent = await this.studentsRepository.findOne({
      where: { userId },
    });

    if (existingStudent && existingStudent.id !== studentId) {
      throw new BadRequestException(`User is already linked to another student`);
    }

    // Update user role if not already a student
    if (user.role !== UserRole.STUDENT) {
      await this.usersRepository.update(userId, { role: UserRole.STUDENT });
    }

    // Update student with user ID
    student.userId = userId;
    return this.studentsRepository.save(student);
  }

  /**
   * Link an existing user account to a parent
   * @param parentId The ID of the parent
   * @param userId The ID of the user
   * @returns The updated parent
   */
  async linkParentToUser(parentId: string, userId: string): Promise<Parent> {
    // Find the parent
    const parent = await this.parentsRepository.findOne({
      where: { id: parentId },
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }

    // Find the user
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user is already linked to another parent
    const existingParent = await this.parentsRepository.findOne({
      where: { userId },
    });

    if (existingParent && existingParent.id !== parentId) {
      throw new BadRequestException(`User is already linked to another parent`);
    }

    // Update user role if not already a parent
    if (user.role !== UserRole.PARENT) {
      await this.usersRepository.update(userId, { role: UserRole.PARENT });
    }

    // Update parent with user ID
    parent.userId = userId;
    return this.parentsRepository.save(parent);
  }

  /**
   * Unlink a user account from a student
   * @param studentId The ID of the student
   * @returns The updated student
   */
  async unlinkStudentFromUser(studentId: string): Promise<Student> {
    // Find the student
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    if (!student.userId) {
      throw new BadRequestException(`Student is not linked to any user account`);
    }

    // Update student to remove user ID
    student.userId = null;
    return this.studentsRepository.save(student);
  }

  /**
   * Unlink a user account from a parent
   * @param parentId The ID of the parent
   * @returns The updated parent
   */
  async unlinkParentFromUser(parentId: string): Promise<Parent> {
    // Find the parent
    const parent = await this.parentsRepository.findOne({
      where: { id: parentId },
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }

    if (!parent.userId) {
      throw new BadRequestException(`Parent is not linked to any user account`);
    }

    // Update parent to remove user ID
    parent.userId = null;
    return this.parentsRepository.save(parent);
  }
}

