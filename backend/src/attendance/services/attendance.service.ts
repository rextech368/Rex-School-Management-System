import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { Student } from '../../students/entities/student.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { BulkCreateAttendanceDto } from '../dto/bulk-create-attendance.dto';
import { AttendanceFilterDto } from '../dto/attendance-filter.dto';
import { AttendanceStatus } from '../enums/attendance-status.enum';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a new attendance record
   * @param createAttendanceDto Attendance data
   * @returns Created attendance record
   */
  async create(createAttendanceDto: CreateAttendanceDto): Promise<AttendanceRecord> {
    try {
      // Check if student exists
      const student = await this.studentRepository.findOneBy({ id: createAttendanceDto.studentId });
      if (!student) {
        throw new NotFoundException(`Student with ID ${createAttendanceDto.studentId} not found`);
      }

      // Check if attendance record already exists for this student and date
      const existingRecord = await this.attendanceRepository.findOne({
        where: {
          studentId: createAttendanceDto.studentId,
          date: createAttendanceDto.date,
        },
      });

      if (existingRecord) {
        throw new BadRequestException(
          `Attendance record already exists for student ${createAttendanceDto.studentId} on ${createAttendanceDto.date}`,
        );
      }

      // Create new attendance record
      const attendanceRecord = this.attendanceRepository.create(createAttendanceDto);
      const savedRecord = await this.attendanceRepository.save(attendanceRecord);

      // Send notification for absences if enabled
      if (
        savedRecord.status === AttendanceStatus.ABSENT && 
        !savedRecord.isExcused &&
        this.configService.get<boolean>('ATTENDANCE_NOTIFICATIONS_ENABLED')
      ) {
        await this.sendAbsenceNotification(savedRecord, student);
      }

      return savedRecord;
    } catch (error) {
      this.logger.error(`Failed to create attendance record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multiple attendance records in bulk
   * @param bulkCreateAttendanceDto Bulk attendance data
   * @returns Created attendance records
   */
  async bulkCreate(bulkCreateAttendanceDto: BulkCreateAttendanceDto): Promise<AttendanceRecord[]> {
    try {
      const { date, classId, recordedBy, records } = bulkCreateAttendanceDto;

      // Get all student IDs
      const studentIds = records.map(record => record.studentId);

      // Check if all students exist
      const students = await this.studentRepository.find({
        where: { id: In(studentIds) },
      });

      if (students.length !== studentIds.length) {
        throw new NotFoundException('One or more students not found');
      }

      // Check for existing records
      const existingRecords = await this.attendanceRepository.find({
        where: {
          studentId: In(studentIds),
          date,
        },
      });

      if (existingRecords.length > 0) {
        const existingStudentIds = existingRecords.map(record => record.studentId);
        throw new BadRequestException(
          `Attendance records already exist for students ${existingStudentIds.join(', ')} on ${date}`,
        );
      }

      // Create attendance records
      const attendanceRecords = records.map(record => {
        return this.attendanceRepository.create({
          ...record,
          date,
          classId,
          recordedBy,
        });
      });

      const savedRecords = await this.attendanceRepository.save(attendanceRecords);

      // Send notifications for absences if enabled
      if (this.configService.get<boolean>('ATTENDANCE_NOTIFICATIONS_ENABLED')) {
        const absentRecords = savedRecords.filter(
          record => record.status === AttendanceStatus.ABSENT && !record.isExcused
        );

        for (const record of absentRecords) {
          const student = students.find(s => s.id === record.studentId);
          await this.sendAbsenceNotification(record, student);
        }
      }

      return savedRecords;
    } catch (error) {
      this.logger.error(`Failed to create bulk attendance records: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all attendance records with optional filtering
   * @param filterDto Filter criteria
   * @returns Filtered attendance records
   */
  async findAll(filterDto: AttendanceFilterDto): Promise<AttendanceRecord[]> {
    try {
      const { studentId, startDate, endDate, status, classId, studentName } = filterDto;
      
      const queryBuilder = this.attendanceRepository.createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student');
      
      if (studentId) {
        queryBuilder.andWhere('attendance.studentId = :studentId', { studentId });
      }
      
      if (startDate && endDate) {
        queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else if (startDate) {
        queryBuilder.andWhere('attendance.date >= :startDate', { startDate });
      } else if (endDate) {
        queryBuilder.andWhere('attendance.date <= :endDate', { endDate });
      }
      
      if (status) {
        queryBuilder.andWhere('attendance.status = :status', { status });
      }
      
      if (classId) {
        queryBuilder.andWhere('attendance.classId = :classId', { classId });
      }
      
      if (studentName) {
        queryBuilder.andWhere(
          '(student.firstName ILIKE :studentName OR student.lastName ILIKE :studentName)',
          { studentName: `%${studentName}%` }
        );
      }
      
      return queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Failed to find attendance records: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find attendance record by ID
   * @param id Attendance record ID
   * @returns Attendance record
   */
  async findOne(id: string): Promise<AttendanceRecord> {
    try {
      const attendanceRecord = await this.attendanceRepository.findOne({
        where: { id },
        relations: ['student'],
      });
      
      if (!attendanceRecord) {
        throw new NotFoundException(`Attendance record with ID ${id} not found`);
      }
      
      return attendanceRecord;
    } catch (error) {
      this.logger.error(`Failed to find attendance record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update attendance record
   * @param id Attendance record ID
   * @param updateAttendanceDto Updated attendance data
   * @returns Updated attendance record
   */
  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<AttendanceRecord> {
    try {
      const attendanceRecord = await this.findOne(id);
      
      // Check if status changed from present to absent
      const statusChanged = 
        updateAttendanceDto.status && 
        updateAttendanceDto.status === AttendanceStatus.ABSENT &&
        attendanceRecord.status !== AttendanceStatus.ABSENT;
      
      // Update record
      const updatedRecord = await this.attendanceRepository.save({
        ...attendanceRecord,
        ...updateAttendanceDto,
      });
      
      // Send notification if status changed to absent and notifications are enabled
      if (
        statusChanged && 
        !updatedRecord.isExcused && 
        !updatedRecord.notificationSent &&
        this.configService.get<boolean>('ATTENDANCE_NOTIFICATIONS_ENABLED')
      ) {
        await this.sendAbsenceNotification(updatedRecord, attendanceRecord.student);
      }
      
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Failed to update attendance record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete attendance record
   * @param id Attendance record ID
   * @returns Deleted attendance record
   */
  async remove(id: string): Promise<AttendanceRecord> {
    try {
      const attendanceRecord = await this.findOne(id);
      return this.attendanceRepository.remove(attendanceRecord);
    } catch (error) {
      this.logger.error(`Failed to remove attendance record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get attendance statistics for a student
   * @param studentId Student ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Attendance statistics
   */
  async getStudentStatistics(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      // Check if student exists
      const student = await this.studentRepository.findOneBy({ id: studentId });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
      
      // Get attendance records for the student
      const attendanceRecords = await this.attendanceRepository.find({
        where: {
          studentId,
          date: Between(startDate, endDate),
        },
      });
      
      // Calculate statistics
      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter(
        record => record.status === AttendanceStatus.PRESENT
      ).length;
      const absentDays = attendanceRecords.filter(
        record => record.status === AttendanceStatus.ABSENT
      ).length;
      const lateDays = attendanceRecords.filter(
        record => record.status === AttendanceStatus.LATE
      ).length;
      const excusedDays = attendanceRecords.filter(
        record => record.status === AttendanceStatus.EXCUSED
      ).length;
      const partialDays = attendanceRecords.filter(
        record => record.status === AttendanceStatus.PARTIAL
      ).length;
      
      // Calculate attendance rate
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      
      return {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        startDate,
        endDate,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        partialDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100, // Round to 2 decimal places
      };
    } catch (error) {
      this.logger.error(`Failed to get student attendance statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send notification for absent student
   * @param attendanceRecord Attendance record
   * @param student Student
   */
  private async sendAbsenceNotification(
    attendanceRecord: AttendanceRecord,
    student: Student,
  ): Promise<void> {
    try {
      // Get student guardians
      const studentWithGuardians = await this.studentRepository.findOne({
        where: { id: student.id },
        relations: ['guardians'],
      });
      
      if (!studentWithGuardians || !studentWithGuardians.guardians?.length) {
        this.logger.warn(`No guardians found for student ${student.id}, skipping absence notification`);
        return;
      }
      
      // Send notification to each guardian
      for (const guardian of studentWithGuardians.guardians) {
        if (guardian.email) {
          await this.notificationService.sendEmail({
            to: guardian.email,
            subject: 'Student Absence Notification',
            templateName: 'absence-notification',
            context: {
              guardianName: guardian.name,
              studentName: `${student.firstName} ${student.lastName}`,
              date: attendanceRecord.date.toLocaleDateString(),
              schoolName: this.configService.get<string>('SCHOOL_NAME'),
              contactEmail: this.configService.get<string>('SCHOOL_CONTACT_EMAIL'),
              contactPhone: this.configService.get<string>('SCHOOL_CONTACT_PHONE'),
            },
          });
        }
        
        if (guardian.phoneNumber) {
          await this.notificationService.sendSms({
            to: guardian.phoneNumber,
            templateName: 'absence-notification',
            context: {
              guardianName: guardian.name,
              studentName: `${student.firstName} ${student.lastName}`,
              date: attendanceRecord.date.toLocaleDateString(),
            },
          });
        }
      }
      
      // Update notification sent status
      await this.attendanceRepository.update(attendanceRecord.id, { notificationSent: true });
      
      this.logger.log(`Absence notification sent for student ${student.id}`);
    } catch (error) {
      this.logger.error(`Failed to send absence notification: ${error.message}`);
      // Don't throw the error to prevent the main operation from failing
    }
  }
}

