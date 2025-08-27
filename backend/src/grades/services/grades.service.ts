import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GradeItem } from '../entities/grade-item.entity';
import { GradeEntry } from '../entities/grade-entry.entity';
import { GradeTemplate } from '../entities/grade-template.entity';
import { Student } from '../../students/entities/student.entity';
import { CreateGradeItemDto } from '../dto/create-grade-item.dto';
import { UpdateGradeItemDto } from '../dto/update-grade-item.dto';
import { CreateGradeEntryDto } from '../dto/create-grade-entry.dto';
import { UpdateGradeEntryDto } from '../dto/update-grade-entry.dto';
import { BulkCreateGradeEntriesDto } from '../dto/bulk-create-grade-entries.dto';
import { GradeFilterDto } from '../dto/grade-filter.dto';
import { CreateGradeTemplateDto } from '../dto/create-grade-template.dto';
import { UpdateGradeTemplateDto } from '../dto/update-grade-template.dto';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  constructor(
    @InjectRepository(GradeItem)
    private gradeItemRepository: Repository<GradeItem>,
    @InjectRepository(GradeEntry)
    private gradeEntryRepository: Repository<GradeEntry>,
    @InjectRepository(GradeTemplate)
    private gradeTemplateRepository: Repository<GradeTemplate>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a new grade item
   */
  async createGradeItem(createGradeItemDto: CreateGradeItemDto): Promise<GradeItem> {
    try {
      const gradeItem = this.gradeItemRepository.create(createGradeItemDto);
      return await this.gradeItemRepository.save(gradeItem);
    } catch (error) {
      this.logger.error(`Failed to create grade item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all grade items with optional filtering
   */
  async findAllGradeItems(filterDto: GradeFilterDto): Promise<GradeItem[]> {
    try {
      const { classId, subjectId, type, startDate, endDate, published } = filterDto;
      
      const queryBuilder = this.gradeItemRepository.createQueryBuilder('gradeItem');
      
      if (classId) {
        queryBuilder.andWhere('gradeItem.classId = :classId', { classId });
      }
      
      if (subjectId) {
        queryBuilder.andWhere('gradeItem.subjectId = :subjectId', { subjectId });
      }
      
      if (type) {
        queryBuilder.andWhere('gradeItem.type = :type', { type });
      }
      
      if (startDate && endDate) {
        queryBuilder.andWhere('gradeItem.assignedDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else if (startDate) {
        queryBuilder.andWhere('gradeItem.assignedDate >= :startDate', { startDate });
      } else if (endDate) {
        queryBuilder.andWhere('gradeItem.assignedDate <= :endDate', { endDate });
      }
      
      if (published === 'true') {
        queryBuilder.andWhere('gradeItem.isPublished = true');
      } else if (published === 'false') {
        queryBuilder.andWhere('gradeItem.isPublished = false');
      }
      
      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find grade items: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find grade item by ID
   */
  async findGradeItemById(id: string): Promise<GradeItem> {
    try {
      const gradeItem = await this.gradeItemRepository.findOne({
        where: { id },
        relations: ['entries', 'entries.student'],
      });
      
      if (!gradeItem) {
        throw new NotFoundException(`Grade item with ID ${id} not found`);
      }
      
      return gradeItem;
    } catch (error) {
      this.logger.error(`Failed to find grade item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update grade item
   */
  async updateGradeItem(id: string, updateGradeItemDto: UpdateGradeItemDto): Promise<GradeItem> {
    try {
      const gradeItem = await this.findGradeItemById(id);
      
      // Check if publishing status changed from false to true
      const isNewlyPublished = 
        updateGradeItemDto.isPublished === true && 
        gradeItem.isPublished === false;
      
      // Update grade item
      const updatedGradeItem = await this.gradeItemRepository.save({
        ...gradeItem,
        ...updateGradeItemDto,
      });
      
      // Send notifications if grade item is newly published and notifications are enabled
      if (
        isNewlyPublished && 
        this.configService.get<boolean>('GRADE_NOTIFICATIONS_ENABLED')
      ) {
        await this.sendGradePublishedNotifications(updatedGradeItem);
      }
      
      return updatedGradeItem;
    } catch (error) {
      this.logger.error(`Failed to update grade item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete grade item
   */
  async removeGradeItem(id: string): Promise<GradeItem> {
    try {
      const gradeItem = await this.findGradeItemById(id);
      return this.gradeItemRepository.remove(gradeItem);
    } catch (error) {
      this.logger.error(`Failed to remove grade item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new grade entry
   */
  async createGradeEntry(createGradeEntryDto: CreateGradeEntryDto): Promise<GradeEntry> {
    try {
      // Check if grade item exists
      const gradeItem = await this.gradeItemRepository.findOneBy({ 
        id: createGradeEntryDto.gradeItemId 
      });
      
      if (!gradeItem) {
        throw new NotFoundException(`Grade item with ID ${createGradeEntryDto.gradeItemId} not found`);
      }
      
      // Check if student exists
      const student = await this.studentRepository.findOneBy({ 
        id: createGradeEntryDto.studentId 
      });
      
      if (!student) {
        throw new NotFoundException(`Student with ID ${createGradeEntryDto.studentId} not found`);
      }
      
      // Check if entry already exists for this student and grade item
      const existingEntry = await this.gradeEntryRepository.findOne({
        where: {
          gradeItemId: createGradeEntryDto.gradeItemId,
          studentId: createGradeEntryDto.studentId,
        },
      });
      
      if (existingEntry) {
        throw new BadRequestException(
          `Grade entry already exists for student ${createGradeEntryDto.studentId} and grade item ${createGradeEntryDto.gradeItemId}`,
        );
      }
      
      // Validate score against max score
      if (createGradeEntryDto.score > gradeItem.maxScore) {
        throw new BadRequestException(
          `Score ${createGradeEntryDto.score} exceeds maximum score ${gradeItem.maxScore}`,
        );
      }
      
      // Create grade entry
      const gradeEntry = this.gradeEntryRepository.create({
        ...createGradeEntryDto,
        submittedAt: createGradeEntryDto.isSubmitted ? new Date() : null,
      });
      
      const savedEntry = await this.gradeEntryRepository.save(gradeEntry);
      
      // Send notification if grade is submitted and published and notifications are enabled
      if (
        savedEntry.isSubmitted && 
        gradeItem.isPublished && 
        this.configService.get<boolean>('GRADE_NOTIFICATIONS_ENABLED')
      ) {
        await this.sendGradeEntryNotification(savedEntry, gradeItem, student);
      }
      
      return savedEntry;
    } catch (error) {
      this.logger.error(`Failed to create grade entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multiple grade entries in bulk
   */
  async bulkCreateGradeEntries(bulkCreateGradeEntriesDto: BulkCreateGradeEntriesDto): Promise<GradeEntry[]> {
    try {
      const { gradeItemId, entries } = bulkCreateGradeEntriesDto;
      
      // Check if grade item exists
      const gradeItem = await this.gradeItemRepository.findOneBy({ id: gradeItemId });
      if (!gradeItem) {
        throw new NotFoundException(`Grade item with ID ${gradeItemId} not found`);
      }
      
      // Get all student IDs
      const studentIds = entries.map(entry => entry.studentId);
      
      // Check if all students exist
      const students = await this.studentRepository.find({
        where: { id: In(studentIds) },
      });
      
      if (students.length !== studentIds.length) {
        throw new NotFoundException('One or more students not found');
      }
      
      // Check for existing entries
      const existingEntries = await this.gradeEntryRepository.find({
        where: {
          gradeItemId,
          studentId: In(studentIds),
        },
      });
      
      if (existingEntries.length > 0) {
        const existingStudentIds = existingEntries.map(entry => entry.studentId);
        throw new BadRequestException(
          `Grade entries already exist for students ${existingStudentIds.join(', ')} and grade item ${gradeItemId}`,
        );
      }
      
      // Create grade entries
      const gradeEntries = entries.map(entry => {
        return this.gradeEntryRepository.create({
          ...entry,
          gradeItemId,
          submittedAt: entry.isSubmitted ? new Date() : null,
        });
      });
      
      const savedEntries = await this.gradeEntryRepository.save(gradeEntries);
      
      // Send notifications if grades are submitted and published and notifications are enabled
      if (
        gradeItem.isPublished && 
        this.configService.get<boolean>('GRADE_NOTIFICATIONS_ENABLED')
      ) {
        const submittedEntries = savedEntries.filter(entry => entry.isSubmitted);
        
        for (const entry of submittedEntries) {
          const student = students.find(s => s.id === entry.studentId);
          await this.sendGradeEntryNotification(entry, gradeItem, student);
        }
      }
      
      return savedEntries;
    } catch (error) {
      this.logger.error(`Failed to create bulk grade entries: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find grade entry by ID
   */
  async findGradeEntryById(id: string): Promise<GradeEntry> {
    try {
      const gradeEntry = await this.gradeEntryRepository.findOne({
        where: { id },
        relations: ['gradeItem', 'student'],
      });
      
      if (!gradeEntry) {
        throw new NotFoundException(`Grade entry with ID ${id} not found`);
      }
      
      return gradeEntry;
    } catch (error) {
      this.logger.error(`Failed to find grade entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all grade entries with optional filtering
   */
  async findAllGradeEntries(filterDto: GradeFilterDto): Promise<GradeEntry[]> {
    try {
      const { studentId, gradeItemId, classId, studentName } = filterDto;
      
      const queryBuilder = this.gradeEntryRepository.createQueryBuilder('gradeEntry')
        .leftJoinAndSelect('gradeEntry.gradeItem', 'gradeItem')
        .leftJoinAndSelect('gradeEntry.student', 'student');
      
      if (studentId) {
        queryBuilder.andWhere('gradeEntry.studentId = :studentId', { studentId });
      }
      
      if (gradeItemId) {
        queryBuilder.andWhere('gradeEntry.gradeItemId = :gradeItemId', { gradeItemId });
      }
      
      if (classId) {
        queryBuilder.andWhere('gradeItem.classId = :classId', { classId });
      }
      
      if (studentName) {
        queryBuilder.andWhere(
          '(student.firstName ILIKE :studentName OR student.lastName ILIKE :studentName)',
          { studentName: `%${studentName}%` }
        );
      }
      
      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find grade entries: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update grade entry
   */
  async updateGradeEntry(id: string, updateGradeEntryDto: UpdateGradeEntryDto): Promise<GradeEntry> {
    try {
      const gradeEntry = await this.findGradeEntryById(id);
      
      // Check if submission status changed from false to true
      const isNewlySubmitted = 
        updateGradeEntryDto.isSubmitted === true && 
        gradeEntry.isSubmitted === false;
      
      // Update grade entry
      const updatedEntry = await this.gradeEntryRepository.save({
        ...gradeEntry,
        ...updateGradeEntryDto,
        submittedAt: isNewlySubmitted ? new Date() : gradeEntry.submittedAt,
        isModified: gradeEntry.isSubmitted ? true : false,
      });
      
      // Send notification if grade is newly submitted and published and notifications are enabled
      if (
        isNewlySubmitted && 
        gradeEntry.gradeItem.isPublished && 
        this.configService.get<boolean>('GRADE_NOTIFICATIONS_ENABLED') &&
        !updatedEntry.notificationSent
      ) {
        await this.sendGradeEntryNotification(updatedEntry, gradeEntry.gradeItem, gradeEntry.student);
      }
      
      return updatedEntry;
    } catch (error) {
      this.logger.error(`Failed to update grade entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete grade entry
   */
  async removeGradeEntry(id: string): Promise<GradeEntry> {
    try {
      const gradeEntry = await this.findGradeEntryById(id);
      return this.gradeEntryRepository.remove(gradeEntry);
    } catch (error) {
      this.logger.error(`Failed to remove grade entry: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new grade template
   */
  async createGradeTemplate(createGradeTemplateDto: CreateGradeTemplateDto): Promise<GradeTemplate> {
    try {
      // Validate categories sum to 100%
      const categoryValues = Object.values(createGradeTemplateDto.categories);
      const sum = categoryValues.reduce((acc, val) => acc + val, 0);
      
      if (sum !== 100) {
        throw new BadRequestException('Category weights must sum to 100%');
      }
      
      const gradeTemplate = this.gradeTemplateRepository.create(createGradeTemplateDto);
      return await this.gradeTemplateRepository.save(gradeTemplate);
    } catch (error) {
      this.logger.error(`Failed to create grade template: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all grade templates
   */
  async findAllGradeTemplates(): Promise<GradeTemplate[]> {
    try {
      return this.gradeTemplateRepository.find();
    } catch (error) {
      this.logger.error(`Failed to find grade templates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find grade template by ID
   */
  async findGradeTemplateById(id: string): Promise<GradeTemplate> {
    try {
      const gradeTemplate = await this.gradeTemplateRepository.findOneBy({ id });
      
      if (!gradeTemplate) {
        throw new NotFoundException(`Grade template with ID ${id} not found`);
      }
      
      return gradeTemplate;
    } catch (error) {
      this.logger.error(`Failed to find grade template: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update grade template
   */
  async updateGradeTemplate(id: string, updateGradeTemplateDto: UpdateGradeTemplateDto): Promise<GradeTemplate> {
    try {
      const gradeTemplate = await this.findGradeTemplateById(id);
      
      // Validate categories sum to 100% if provided
      if (updateGradeTemplateDto.categories) {
        const categoryValues = Object.values(updateGradeTemplateDto.categories);
        const sum = categoryValues.reduce((acc, val) => acc + val, 0);
        
        if (sum !== 100) {
          throw new BadRequestException('Category weights must sum to 100%');
        }
      }
      
      return this.gradeTemplateRepository.save({
        ...gradeTemplate,
        ...updateGradeTemplateDto,
      });
    } catch (error) {
      this.logger.error(`Failed to update grade template: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete grade template
   */
  async removeGradeTemplate(id: string): Promise<GradeTemplate> {
    try {
      const gradeTemplate = await this.findGradeTemplateById(id);
      
      // Prevent deletion of system default templates
      if (gradeTemplate.isSystemDefault) {
        throw new BadRequestException('Cannot delete system default templates');
      }
      
      return this.gradeTemplateRepository.remove(gradeTemplate);
    } catch (error) {
      this.logger.error(`Failed to remove grade template: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate student grade statistics
   */
  async calculateStudentGradeStatistics(studentId: string, classId: string): Promise<any> {
    try {
      // Check if student exists
      const student = await this.studentRepository.findOneBy({ id: studentId });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
      
      // Get all grade items for the class
      const gradeItems = await this.gradeItemRepository.find({
        where: { classId },
      });
      
      if (gradeItems.length === 0) {
        return {
          studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          classId,
          totalItems: 0,
          completedItems: 0,
          averageScore: 0,
          weightedAverage: 0,
          categoryBreakdown: {},
        };
      }
      
      // Get all grade entries for the student in this class
      const gradeEntries = await this.gradeEntryRepository.find({
        where: {
          studentId,
          gradeItemId: In(gradeItems.map(item => item.id)),
        },
        relations: ['gradeItem'],
      });
      
      // Calculate statistics
      const totalItems = gradeItems.length;
      const completedItems = gradeEntries.length;
      
      // Calculate average score (unweighted)
      let totalScore = 0;
      for (const entry of gradeEntries) {
        const percentageScore = (entry.score / entry.gradeItem.maxScore) * 100;
        totalScore += percentageScore;
      }
      const averageScore = completedItems > 0 ? totalScore / completedItems : 0;
      
      // Calculate weighted average
      let weightedTotal = 0;
      let weightSum = 0;
      for (const entry of gradeEntries) {
        const percentageScore = (entry.score / entry.gradeItem.maxScore) * 100;
        weightedTotal += percentageScore * entry.gradeItem.weight;
        weightSum += entry.gradeItem.weight;
      }
      const weightedAverage = weightSum > 0 ? weightedTotal / weightSum : 0;
      
      // Calculate category breakdown
      const categoryBreakdown = {};
      const categoryItems = {};
      
      for (const item of gradeItems) {
        if (!categoryBreakdown[item.type]) {
          categoryBreakdown[item.type] = {
            totalItems: 0,
            completedItems: 0,
            averageScore: 0,
            weightedAverage: 0,
          };
          categoryItems[item.type] = [];
        }
        
        categoryBreakdown[item.type].totalItems++;
        
        const entry = gradeEntries.find(e => e.gradeItemId === item.id);
        if (entry) {
          categoryBreakdown[item.type].completedItems++;
          categoryItems[item.type].push({
            entry,
            item,
            percentageScore: (entry.score / item.maxScore) * 100,
          });
        }
      }
      
      // Calculate category averages
      for (const category in categoryBreakdown) {
        const items = categoryItems[category];
        
        if (items.length > 0) {
          // Unweighted average
          const categoryTotal = items.reduce((sum, item) => sum + item.percentageScore, 0);
          categoryBreakdown[category].averageScore = categoryTotal / items.length;
          
          // Weighted average
          const categoryWeightedTotal = items.reduce(
            (sum, item) => sum + item.percentageScore * item.item.weight, 
            0
          );
          const categoryWeightSum = items.reduce(
            (sum, item) => sum + item.item.weight, 
            0
          );
          
          categoryBreakdown[category].weightedAverage = 
            categoryWeightSum > 0 ? categoryWeightedTotal / categoryWeightSum : 0;
        }
      }
      
      return {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        classId,
        totalItems,
        completedItems,
        averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
        weightedAverage: Math.round(weightedAverage * 100) / 100, // Round to 2 decimal places
        categoryBreakdown,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate student grade statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send notification for newly published grades
   */
  private async sendGradePublishedNotifications(gradeItem: GradeItem): Promise<void> {
    try {
      // Get all grade entries for this item
      const entries = await this.gradeEntryRepository.find({
        where: {
          gradeItemId: gradeItem.id,
          isSubmitted: true,
          notificationSent: false,
        },
        relations: ['student'],
      });
      
      if (entries.length === 0) {
        return;
      }
      
      // Send notifications for each entry
      for (const entry of entries) {
        await this.sendGradeEntryNotification(entry, gradeItem, entry.student);
      }
    } catch (error) {
      this.logger.error(`Failed to send grade published notifications: ${error.message}`);
      // Don't throw the error to prevent the main operation from failing
    }
  }

  /**
   * Send notification for a grade entry
   */
  private async sendGradeEntryNotification(
    gradeEntry: GradeEntry,
    gradeItem: GradeItem,
    student: Student,
  ): Promise<void> {
    try {
      // Get student guardians
      const studentWithGuardians = await this.studentRepository.findOne({
        where: { id: student.id },
        relations: ['guardians'],
      });
      
      if (!studentWithGuardians || !studentWithGuardians.guardians?.length) {
        this.logger.warn(`No guardians found for student ${student.id}, skipping grade notification`);
        return;
      }
      
      // Calculate percentage score
      const percentageScore = (gradeEntry.score / gradeItem.maxScore) * 100;
      
      // Send notification to each guardian
      for (const guardian of studentWithGuardians.guardians) {
        if (guardian.email) {
          await this.notificationService.sendEmail({
            to: guardian.email,
            subject: 'New Grade Posted',
            templateName: 'grade-notification',
            context: {
              guardianName: guardian.name,
              studentName: `${student.firstName} ${student.lastName}`,
              gradeItemTitle: gradeItem.title,
              gradeItemType: gradeItem.type,
              score: gradeEntry.score,
              maxScore: gradeItem.maxScore,
              percentageScore: Math.round(percentageScore * 100) / 100,
              letterGrade: gradeEntry.letterGrade || '',
              feedback: gradeEntry.feedback || '',
              schoolName: this.configService.get<string>('SCHOOL_NAME'),
              portalUrl: this.configService.get<string>('STUDENT_PORTAL_URL'),
            },
          });
        }
        
        if (guardian.phoneNumber) {
          await this.notificationService.sendSms({
            to: guardian.phoneNumber,
            templateName: 'grade-notification',
            context: {
              guardianName: guardian.name,
              studentName: `${student.firstName} ${student.lastName}`,
              gradeItemTitle: gradeItem.title,
              score: gradeEntry.score,
              maxScore: gradeItem.maxScore,
              percentageScore: Math.round(percentageScore * 100) / 100,
            },
          });
        }
      }
      
      // Update notification sent status
      await this.gradeEntryRepository.update(gradeEntry.id, { notificationSent: true });
      
      this.logger.log(`Grade notification sent for student ${student.id}`);
    } catch (error) {
      this.logger.error(`Failed to send grade notification: ${error.message}`);
      // Don't throw the error to prevent the main operation from failing
    }
  }
}

