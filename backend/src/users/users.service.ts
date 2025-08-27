import { Injectable, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto, 
  UserFilterDto,
  ChangePasswordDto,
  UpdateProfileDto,
  UpdateSettingsDto
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserResponseDto> {
    // Check if username already exists
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: createUserDto.password, // Will be hashed by entity hook
      created_by: createdBy,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(savedUser);
  }

  async findAll(filterDto: UserFilterDto): Promise<{ data: UserResponseDto[], total: number }> {
    const { 
      search, 
      role, 
      status, 
      emailVerified,
      page = 1, 
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filterDto;

    const where: FindOptionsWhere<User> = {};

    // Apply filters
    if (search) {
      where.username = Like(`%${search}%`);
      // TODO: Add more complex search with OR conditions for email, firstName, lastName
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (emailVerified !== undefined) {
      where.email_verified = emailVerified;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });

    return {
      data: users.map(user => this.mapToUserResponse(user)),
      total,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponse(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if username is being changed and already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Handle password change if provided
    if (updateUserDto.password) {
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Password will be hashed by entity hook
      user.password_hash = updateUserDto.password;
    }

    // Remove password fields from DTO to avoid overwriting
    const { password, currentPassword, ...updateData } = updateUserDto;

    // Update user
    Object.assign(user, updateData);
    user.updated_by = updatedBy;

    const updatedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(updatedUser);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete
    user.deleted_by = deletedBy;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Update password
    user.password_hash = newPassword; // Will be hashed by entity hook
    await this.usersRepository.save(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Update profile fields
    Object.assign(user, updateProfileDto);
    
    const updatedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(updatedUser);
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Initialize settings object if it doesn't exist
    user.settings = user.settings || {};

    // Update settings
    if (updateSettingsDto.notifications) {
      user.settings.notifications = {
        ...user.settings.notifications,
        ...updateSettingsDto.notifications,
      };
    }

    if (updateSettingsDto.display) {
      user.settings.display = {
        ...user.settings.display,
        ...updateSettingsDto.display,
      };
    }

    if (updateSettingsDto.privacy) {
      user.settings.privacy = {
        ...user.settings.privacy,
        ...updateSettingsDto.privacy,
      };
    }

    const updatedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(updatedUser);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      last_login: new Date(),
    });
  }

  async changeUserStatus(id: string, status: UserStatus, updatedBy: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = status;
    user.updated_by = updatedBy;

    const updatedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(updatedUser);
  }

  async changeUserRole(id: string, role: UserRole, updatedBy: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.role = role;
    user.updated_by = updatedBy;

    const updatedUser = await this.usersRepository.save(user);
    return this.mapToUserResponse(updatedUser);
  }

  // Helper method to map User entity to UserResponseDto
  private mapToUserResponse(user: User): UserResponseDto {
    const { password_hash, password_reset_token, email_verification_token, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }
}

