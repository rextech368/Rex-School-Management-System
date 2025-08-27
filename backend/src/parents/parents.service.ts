import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, In } from 'typeorm';
import { Parent, RelationshipType } from './entities/parent.entity';
import { ParentPreferences } from './entities/parent-preferences.entity';
import { CreateParentDto, UpdateParentDto, ParentFilterDto } from './dto';
import { Student } from '../students/entities/student.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class ParentsService {
  private readonly logger = new Logger(ParentsService.name);

  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    @InjectRepository(ParentPreferences)
    private preferencesRepository: Repository<ParentPreferences>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findAll(filterDto: ParentFilterDto) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      name,
      email,
      phoneNumber,
      studentId,
      relationshipType,
      city,
      country,
      occupation,
      emergencyContactPriority,
      isAuthorizedForPickup,
      hasFinancialResponsibility,
      includeInactive = false
    } = filterDto;

    const skip = (page - 1) * limit;
    
    const whereClause: FindOptionsWhere<Parent> = {};
    
    // Apply filters
    if (name) {
      whereClause.firstName = Like(`%${name}%`);
      // TODO: Add OR conditions for last name
    }
    
    if (email) {
      whereClause.email = Like(`%${email}%`);
    }
    
    if (phoneNumber) {
      whereClause.phoneNumber = Like(`%${phoneNumber}%`);
    }
    
    if (relationshipType) {
      whereClause.relationshipType = relationshipType;
    }
    
    if (city) {
      whereClause.city = Like(`%${city}%`);
    }
    
    if (country) {
      whereClause.country = Like(`%${country}%`);
    }
    
    if (occupation) {
      whereClause.occupation = Like(`%${occupation}%`);
    }
    
    if (emergencyContactPriority) {
      whereClause.emergencyContactPriority = emergencyContactPriority;
    }
    
    if (isAuthorizedForPickup !== undefined) {
      whereClause.isAuthorizedForPickup = isAuthorizedForPickup;
    }
    
    if (hasFinancialResponsibility !== undefined) {
      whereClause.hasFinancialResponsibility = hasFinancialResponsibility;
    }
    
    if (!includeInactive) {
      // By default, only show active parents
      whereClause.status = 'active';
    }

    // Handle student filter separately as it requires a join
    let query = this.parentsRepository.createQueryBuilder('parent')
      .leftJoinAndSelect('parent.students', 'student')
      .leftJoinAndSelect('parent.user', 'user')
      .leftJoinAndSelect('parent.preferences', 'preferences');
    
    // Apply where clause
    if (Object.keys(whereClause).length > 0) {
      for (const [key, value] of Object.entries(whereClause)) {
        if (value instanceof Object && 'operator' in value) {
          // Handle complex operators like Like
          query = query.andWhere(`parent.${key} ${value['operator']} :${key}Value`, {
            [`${key}Value`]: value['value']
          });
        } else {
          query = query.andWhere(`parent.${key} = :${key}`, { [key]: value });
        }
      }
    }
    
    // Apply student filter if provided
    if (studentId) {
      query = query.andWhere('student.id = :studentId', { studentId });
    }
    
    // Apply pagination and sorting
    query = query
      .skip(skip)
      .take(limit)
      .orderBy(`parent.${sortBy}`, sortOrder);
    
    const [parents, total] = await query.getManyAndCount();

    return {
      data: parents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const parent = await this.parentsRepository.findOne({
      where: { id },
      relations: ['students', 'user', 'preferences'],
    });
    
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    
    return parent;
  }

  async findByEmail(email: string) {
    const parent = await this.parentsRepository.findOne({
      where: { email },
      relations: ['students', 'user', 'preferences'],
    });
    
    if (!parent) {
      throw new NotFoundException(`Parent with email ${email} not found`);
    }
    
    return parent;
  }

  async create(dto: CreateParentDto, currentUserId?: string) {
    // Check if email already exists
    const existingParent = await this.parentsRepository.findOne({
      where: { email: dto.email },
    });
    
    if (existingParent) {
      throw new ConflictException(`Parent with email ${dto.email} already exists`);
    }

    // Verify that all student IDs exist
    const students = await this.studentsRepository.find({
      where: { id: In(dto.studentIds) },
    });
    
    if (students.length !== dto.studentIds.length) {
      throw new BadRequestException('One or more student IDs are invalid');
    }

    // Create user account if requested
    let user: User | undefined;
    if (dto.createUserAccount) {
      // Generate a temporary password
      const tempPassword = randomBytes(8).toString('hex');
      
      // Create user with parent role
      user = this.usersRepository.create({
        email: dto.email,
        fullName: `${dto.firstName} ${dto.lastName}`,
        password: tempPassword, // This will be hashed by the entity's BeforeInsert hook
        role: UserRole.PARENT,
        status: UserStatus.ACTIVE,
        phoneNumber: dto.phoneNumber,
        profilePicture: dto.profilePicture,
        createdBy: currentUserId,
      });
      
      try {
        user = await this.usersRepository.save(user);
        this.logger.log(`Created user account for parent ${dto.email}`);
        
        // TODO: Send email with temporary password
      } catch (error) {
        this.logger.error(`Failed to create user account for parent: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to create user account for parent');
      }
    }

    // Create parent preferences if provided
    let preferences: ParentPreferences | undefined;
    if (dto.preferences) {
      preferences = this.preferencesRepository.create({
        ...dto.preferences,
        createdBy: currentUserId,
      });
      
      try {
        preferences = await this.preferencesRepository.save(preferences);
      } catch (error) {
        // If user was created but preferences creation failed, delete the user
        if (user) {
          await this.usersRepository.delete(user.id);
        }
        
        this.logger.error(`Failed to create parent preferences: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to create parent preferences');
      }
    }

    // Create parent entity
    const parent = this.parentsRepository.create({
      ...dto,
      userId: user?.id,
      students,
      preferences,
      createdBy: currentUserId,
    });
    
    try {
      const savedParent = await this.parentsRepository.save(parent);
      this.logger.log(`Created parent with ID ${savedParent.id}`);
      
      // Return parent with relations
      savedParent.user = user;
      savedParent.students = students;
      savedParent.preferences = preferences;
      
      return savedParent;
    } catch (error) {
      // If user or preferences were created but parent creation failed, delete them
      if (user) {
        await this.usersRepository.delete(user.id);
      }
      
      if (preferences) {
        await this.preferencesRepository.delete(preferences.id);
      }
      
      this.logger.error(`Failed to create parent: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create parent');
    }
  }

  async update(id: string, dto: UpdateParentDto, currentUserId?: string) {
    const parent = await this.parentsRepository.findOne({ 
      where: { id },
      relations: ['students', 'user', 'preferences']
    });
    
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }

    // Update students if provided
    if (dto.studentIds && dto.studentIds.length > 0) {
      const students = await this.studentsRepository.find({
        where: { id: In(dto.studentIds) },
      });
      
      if (students.length !== dto.studentIds.length) {
        throw new BadRequestException('One or more student IDs are invalid');
      }
      
      parent.students = students;
    }

    // Update user information if it exists
    if (parent.user && (dto.email || dto.phoneNumber || dto.profilePicture)) {
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
        userUpdates.fullName = `${dto.firstName || parent.firstName} ${dto.lastName || parent.lastName}`;
      }
      
      await this.usersRepository.update(parent.user.id, userUpdates);
    }

    // Update preferences if provided
    if (dto.preferences && parent.preferences) {
      Object.assign(parent.preferences, {
        ...dto.preferences,
        updatedBy: currentUserId,
      });
      
      await this.preferencesRepository.save(parent.preferences);
    } else if (dto.preferences && !parent.preferences) {
      // Create new preferences if they don't exist
      const preferences = this.preferencesRepository.create({
        ...dto.preferences,
        createdBy: currentUserId,
      });
      
      const savedPreferences = await this.preferencesRepository.save(preferences);
      parent.preferences = savedPreferences;
    }

    // Update parent
    Object.assign(parent, {
      ...dto,
      updatedBy: currentUserId,
    });
    
    // Remove properties that should be handled separately
    delete parent['studentIds'];
    delete parent['preferences'];
    
    try {
      const updatedParent = await this.parentsRepository.save(parent);
      this.logger.log(`Updated parent with ID ${id}`);
      return updatedParent;
    } catch (error) {
      this.logger.error(`Failed to update parent: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update parent');
    }
  }

  async remove(id: string, currentUserId?: string) {
    const parent = await this.parentsRepository.findOne({ 
      where: { id },
      relations: ['user', 'preferences']
    });
    
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }

    // Soft delete the parent
    parent.deletedBy = currentUserId;
    await this.parentsRepository.softRemove(parent);
    
    // If there's an associated user, soft delete it too
    if (parent.user) {
      parent.user.deletedBy = currentUserId;
      await this.usersRepository.softRemove(parent.user);
    }
    
    // If there are preferences, soft delete them too
    if (parent.preferences) {
      parent.preferences.deletedBy = currentUserId;
      await this.preferencesRepository.softRemove(parent.preferences);
    }
    
    this.logger.log(`Deleted parent with ID ${id}`);
    return { id, deleted: true };
  }

  async bulkCreate(dtos: CreateParentDto[], currentUserId?: string) {
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
          email: dto.email,
          error: error.message,
        });
      }
    }

    return results;
  }

  async getParentsByStudent(studentId: string) {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: ['parents'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    
    return student.parents;
  }

  async getParentStats() {
    const totalParents = await this.parentsRepository.count();
    
    const activeParents = await this.parentsRepository.count({
      where: { status: 'active' },
    });
    
    const inactiveParents = await this.parentsRepository.count({
      where: { status: 'inactive' },
    });
    
    const fatherCount = await this.parentsRepository.count({
      where: { relationshipType: RelationshipType.FATHER },
    });
    
    const motherCount = await this.parentsRepository.count({
      where: { relationshipType: RelationshipType.MOTHER },
    });
    
    const guardianCount = await this.parentsRepository.count({
      where: { relationshipType: RelationshipType.GUARDIAN },
    });
    
    const grandparentCount = await this.parentsRepository.count({
      where: { relationshipType: RelationshipType.GRANDPARENT },
    });
    
    const otherCount = await this.parentsRepository.count({
      where: { relationshipType: RelationshipType.OTHER },
    });
    
    const authorizedForPickupCount = await this.parentsRepository.count({
      where: { isAuthorizedForPickup: true },
    });
    
    const financialResponsibilityCount = await this.parentsRepository.count({
      where: { hasFinancialResponsibility: true },
    });
    
    return {
      totalParents,
      activeParents,
      inactiveParents,
      relationshipTypes: {
        father: fatherCount,
        mother: motherCount,
        guardian: guardianCount,
        grandparent: grandparentCount,
        other: otherCount,
      },
      authorizedForPickupCount,
      financialResponsibilityCount,
    };
  }
}

