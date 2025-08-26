import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Not, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, createdById?: string): Promise<User> {
    // Check if user with same email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${createUserDto.email} already exists`);
    }

    // Generate random password if requested
    let password = createUserDto.password;
    if (createUserDto.generateRandomPassword) {
      password = this.generateRandomPassword();
    }

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password,
      createdBy: createdById,
    });

    const savedUser = await this.usersRepository.save(user);

    // TODO: Send welcome email if requested
    if (createUserDto.sendWelcomeEmail) {
      // Implement email sending logic
    }

    return savedUser;
  }

  async findAll(filterDto: UserFilterDto): Promise<[User[], number]> {
    const { 
      email, 
      fullName, 
      role, 
      status, 
      phoneNumber,
      isEmailVerified,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filterDto;

    const query = this.usersRepository.createQueryBuilder('user');

    // Apply filters
    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    if (fullName) {
      query.andWhere('user.fullName LIKE :fullName', { fullName: `%${fullName}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    if (phoneNumber) {
      query.andWhere('user.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${phoneNumber}%` });
    }

    if (isEmailVerified !== undefined) {
      query.andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified });
    }

    // Add pagination
    query.skip((page - 1) * limit)
      .take(limit)
      .orderBy(`user.${sortBy}`, sortOrder);

    // Execute query
    const [users, total] = await query.getManyAndCount();
    return [users, total];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.usersRepository.findBy({ role });
  }

  async findByResetToken(token: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ passwordResetToken: token });

    if (!user) {
      throw new NotFoundException('Invalid reset token');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedById?: string): Promise<User> {
    const user = await this.findOne(id);

    // If email is being updated, check if it's already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email, id: Not(id) },
        withDeleted: true,
      });

      if (existingUser) {
        throw new ConflictException(`User with email ${updateUserDto.email} already exists`);
      }
    }

    // Update user
    Object.assign(user, {
      ...updateUserDto,
      updatedBy: updatedById,
    });

    return this.usersRepository.save(user);
  }

  async remove(id: string, deletedById?: string): Promise<void> {
    const user = await this.findOne(id);

    // Soft delete
    user.deletedBy = deletedById;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.findOne(id);
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    
    return this.usersRepository.save(user);
  }

  async updateResetToken(id: string, token: string, expires: Date): Promise<User> {
    const user = await this.findOne(id);
    
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    
    return this.usersRepository.save(user);
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ verificationToken: token });
    
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }
    
    user.isEmailVerified = true;
    user.verificationToken = null;
    
    return this.usersRepository.save(user);
  }

  async updateStatus(id: string, status: UserStatus, updatedById?: string): Promise<User> {
    const user = await this.findOne(id);
    
    user.status = status;
    user.updatedBy = updatedById;
    
    return this.usersRepository.save(user);
  }

  async bulkUpdateStatus(ids: string[], status: UserStatus, updatedById?: string): Promise<void> {
    await this.usersRepository.update(
      { id: In(ids) },
      { status, updatedBy: updatedById }
    );
  }

  async bulkDelete(ids: string[], deletedById?: string): Promise<void> {
    // Update deletedBy for all users
    await this.usersRepository.update(
      { id: In(ids) },
      { deletedBy: deletedById }
    );

    // Soft delete all users
    await this.usersRepository.softDelete(ids);
  }

  async countUsers(filters?: any): Promise<number> {
    return this.usersRepository.count({
      where: filters,
    });
  }

  async getUserStatistics(): Promise<any> {
    const totalUsers = await this.countUsers();
    const activeUsers = await this.countUsers({ status: UserStatus.ACTIVE });
    const pendingUsers = await this.countUsers({ status: UserStatus.PENDING });
    const inactiveUsers = await this.countUsers({ status: UserStatus.INACTIVE });
    const suspendedUsers = await this.countUsers({ status: UserStatus.SUSPENDED });

    const adminUsers = await this.countUsers({ role: UserRole.ADMIN });
    const teacherUsers = await this.countUsers({ role: UserRole.TEACHER });
    const studentUsers = await this.countUsers({ role: UserRole.STUDENT });
    const parentUsers = await this.countUsers({ role: UserRole.PARENT });
    const staffUsers = await this.countUsers({ role: UserRole.STAFF });

    return {
      totalUsers,
      byStatus: {
        activeUsers,
        pendingUsers,
        inactiveUsers,
        suspendedUsers,
      },
      byRole: {
        adminUsers,
        teacherUsers,
        studentUsers,
        parentUsers,
        staffUsers,
      },
    };
  }

  private generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }
}

