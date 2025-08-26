import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, In } from 'typeorm';
import { AttendanceRecord, AttendanceStatus, AttendanceType } from './entities/attendance-record.entity';
import { AttendanceSession, AttendanceSessionStatus } from './entities/attendance-session.entity';
import {
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
  CreateAttendanceSessionDto,
  UpdateAttendanceSessionDto,
  AttendanceFilterDto,
  BulkAttendanceRecordsDto,
  AttendanceRecordResponseDto,
  AttendanceSessionResponseDto,
} from './dto';
import { StudentsService } from '../students/students.service';
import { ClassesService } from '../classes/classes.service';
import { SectionsService } from '../classes/sections.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
    @InjectRepository(AttendanceSession)
    private attendanceSessionRepository: Repository<AttendanceSession>,
    private studentsService: StudentsService,
    private classesService: ClassesService,
    private sectionsService: SectionsService,
  ) {}

  // Attendance Record Methods
  async createAttendanceRecord(
    createAttendanceRecordDto: CreateAttendanceRecordDto,
    userId: string,
  ): Promise<AttendanceRecordResponseDto> {
    // Validate student exists
    await this.studentsService.findOne(createAttendanceRecordDto.studentId);

    // Validate class if provided
    if (createAttendanceRecordDto.classId) {
      await this.classesService.findOne(createAttendanceRecordDto.classId);
    }

    // Validate section if provided
    if (createAttendanceRecordDto.sectionId) {
      await this.sectionsService.findOne(createAttendanceRecordDto.sectionId);
    }

    // Check for duplicate attendance record
    const existingRecord = await this.attendanceRecordRepository.findOne({
      where: {
        studentId: createAttendanceRecordDto.studentId,
        date: createAttendanceRecordDto.date,
        type: createAttendanceRecordDto.type || AttendanceType.DAILY,
      },
    });

    if (existingRecord) {
      throw new BadRequestException(
        `Attendance record already exists for student on this date with the same type`,
      );
    }

    const attendanceRecord = this.attendanceRecordRepository.create({
      ...createAttendanceRecordDto,
      createdBy: userId,
    });

    const savedRecord = await this.attendanceRecordRepository.save(attendanceRecord);
    return this.mapToAttendanceRecordResponseDto(savedRecord);
  }

  async findAllAttendanceRecords(
    filterDto: AttendanceFilterDto,
  ): Promise<{ data: AttendanceRecordResponseDto[]; total: number }> {
    const {
      studentId,
      classId,
      sectionId,
      startDate,
      endDate,
      status,
      type,
      subjectId,
      eventId,
      createdBy,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'DESC',
    } = filterDto;

    const where: FindOptionsWhere<AttendanceRecord> = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (classId) {
      where.classId = classId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    }

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = Between(startDate, new Date());
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    if (createdBy) {
      where.createdBy = createdBy;
    }

    const [records, total] = await this.attendanceRecordRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
      relations: ['student', 'class', 'section', 'creator'],
    });

    const mappedRecords = records.map((record) => this.mapToAttendanceRecordResponseDto(record));

    return {
      data: mappedRecords,
      total,
    };
  }

  async findOneAttendanceRecord(id: string): Promise<AttendanceRecordResponseDto> {
    const record = await this.attendanceRecordRepository.findOne({
      where: { id },
      relations: ['student', 'class', 'section', 'creator'],
    });

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return this.mapToAttendanceRecordResponseDto(record);
  }

  async updateAttendanceRecord(
    id: string,
    updateAttendanceRecordDto: UpdateAttendanceRecordDto,
    userId: string,
  ): Promise<AttendanceRecordResponseDto> {
    const record = await this.findOneAttendanceRecord(id);

    // Validate student exists if changing student
    if (updateAttendanceRecordDto.studentId) {
      await this.studentsService.findOne(updateAttendanceRecordDto.studentId);
    }

    // Validate class if changing class
    if (updateAttendanceRecordDto.classId) {
      await this.classesService.findOne(updateAttendanceRecordDto.classId);
    }

    // Validate section if changing section
    if (updateAttendanceRecordDto.sectionId) {
      await this.sectionsService.findOne(updateAttendanceRecordDto.sectionId);
    }

    // Check for duplicate if changing key fields
    if (
      updateAttendanceRecordDto.studentId ||
      updateAttendanceRecordDto.date ||
      updateAttendanceRecordDto.type
    ) {
      const studentId = updateAttendanceRecordDto.studentId || record.studentId;
      const date = updateAttendanceRecordDto.date || record.date;
      const type = updateAttendanceRecordDto.type || record.type;

      const existingRecord = await this.attendanceRecordRepository.findOne({
        where: {
          studentId,
          date,
          type,
          id: Not(id), // Exclude current record
        },
      });

      if (existingRecord) {
        throw new BadRequestException(
          `Attendance record already exists for student on this date with the same type`,
        );
      }
    }

    await this.attendanceRecordRepository.update(id, {
      ...updateAttendanceRecordDto,
      updatedBy: userId,
    });

    const updatedRecord = await this.attendanceRecordRepository.findOne({
      where: { id },
      relations: ['student', 'class', 'section', 'creator'],
    });

    return this.mapToAttendanceRecordResponseDto(updatedRecord);
  }

  async removeAttendanceRecord(id: string, userId: string): Promise<void> {
    const record = await this.findOneAttendanceRecord(id);
    await this.attendanceRecordRepository.update(id, {
      deletedBy: userId,
    });
    await this.attendanceRecordRepository.softDelete(id);
  }

  // Attendance Session Methods
  async createAttendanceSession(
    createAttendanceSessionDto: CreateAttendanceSessionDto,
    userId: string,
  ): Promise<AttendanceSessionResponseDto> {
    // Validate class if provided
    if (createAttendanceSessionDto.classId) {
      await this.classesService.findOne(createAttendanceSessionDto.classId);
    }

    // Validate section if provided
    if (createAttendanceSessionDto.sectionId) {
      await this.sectionsService.findOne(createAttendanceSessionDto.sectionId);
    }

    // Check for duplicate session
    const existingSession = await this.attendanceSessionRepository.findOne({
      where: {
        classId: createAttendanceSessionDto.classId,
        sectionId: createAttendanceSessionDto.sectionId,
        date: createAttendanceSessionDto.date,
        type: createAttendanceSessionDto.type || AttendanceType.DAILY,
        subjectId: createAttendanceSessionDto.subjectId,
        eventId: createAttendanceSessionDto.eventId,
      },
    });

    if (existingSession) {
      throw new BadRequestException(
        `Attendance session already exists for this class/section on this date with the same type`,
      );
    }

    const attendanceSession = this.attendanceSessionRepository.create({
      ...createAttendanceSessionDto,
      createdBy: userId,
    });

    // Handle attendance records if provided
    if (createAttendanceSessionDto.attendanceRecords?.length) {
      // Calculate counts
      const counts = this.calculateAttendanceCounts(createAttendanceSessionDto.attendanceRecords);
      attendanceSession.totalStudents = counts.total;
      attendanceSession.presentCount = counts.present;
      attendanceSession.absentCount = counts.absent;
      attendanceSession.lateCount = counts.late;
      attendanceSession.excusedCount = counts.excused;
      attendanceSession.halfDayCount = counts.halfDay;
    }

    const savedSession = await this.attendanceSessionRepository.save(attendanceSession);

    // Create attendance records if provided
    if (createAttendanceSessionDto.attendanceRecords?.length) {
      const records = createAttendanceSessionDto.attendanceRecords.map((recordDto) => ({
        ...recordDto,
        classId: createAttendanceSessionDto.classId,
        sectionId: createAttendanceSessionDto.sectionId,
        date: createAttendanceSessionDto.date,
        type: createAttendanceSessionDto.type || AttendanceType.DAILY,
        subjectId: createAttendanceSessionDto.subjectId,
        eventId: createAttendanceSessionDto.eventId,
        createdBy: userId,
      }));

      await this.attendanceRecordRepository.save(records);
    }

    return this.mapToAttendanceSessionResponseDto(savedSession);
  }

  async findAllAttendanceSessions(
    filterDto: AttendanceFilterDto,
  ): Promise<{ data: AttendanceSessionResponseDto[]; total: number }> {
    const {
      classId,
      sectionId,
      startDate,
      endDate,
      type,
      subjectId,
      eventId,
      sessionStatus,
      createdBy,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'DESC',
    } = filterDto;

    const where: FindOptionsWhere<AttendanceSession> = {};

    if (classId) {
      where.classId = classId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    }

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = Between(startDate, new Date());
    }

    if (type) {
      where.type = type;
    }

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    if (sessionStatus) {
      where.status = sessionStatus;
    }

    if (createdBy) {
      where.createdBy = createdBy;
    }

    const [sessions, total] = await this.attendanceSessionRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
      relations: ['class', 'section', 'creator'],
    });

    const mappedSessions = sessions.map((session) => this.mapToAttendanceSessionResponseDto(session));

    return {
      data: mappedSessions,
      total,
    };
  }

  async findOneAttendanceSession(id: string): Promise<AttendanceSessionResponseDto> {
    const session = await this.attendanceSessionRepository.findOne({
      where: { id },
      relations: ['class', 'section', 'creator'],
    });

    if (!session) {
      throw new NotFoundException(`Attendance session with ID ${id} not found`);
    }

    return this.mapToAttendanceSessionResponseDto(session);
  }

  async updateAttendanceSession(
    id: string,
    updateAttendanceSessionDto: UpdateAttendanceSessionDto,
    userId: string,
  ): Promise<AttendanceSessionResponseDto> {
    const session = await this.findOneAttendanceSession(id);

    // Validate class if changing class
    if (updateAttendanceSessionDto.classId) {
      await this.classesService.findOne(updateAttendanceSessionDto.classId);
    }

    // Validate section if changing section
    if (updateAttendanceSessionDto.sectionId) {
      await this.sectionsService.findOne(updateAttendanceSessionDto.sectionId);
    }

    await this.attendanceSessionRepository.update(id, {
      ...updateAttendanceSessionDto,
      updatedBy: userId,
    });

    const updatedSession = await this.attendanceSessionRepository.findOne({
      where: { id },
      relations: ['class', 'section', 'creator'],
    });

    return this.mapToAttendanceSessionResponseDto(updatedSession);
  }

  async removeAttendanceSession(id: string, userId: string): Promise<void> {
    const session = await this.findOneAttendanceSession(id);
    await this.attendanceSessionRepository.update(id, {
      deletedBy: userId,
    });
    await this.attendanceSessionRepository.softDelete(id);
  }

  // Bulk Operations
  async createBulkAttendanceRecords(
    bulkDto: BulkAttendanceRecordsDto,
    userId: string,
  ): Promise<AttendanceSessionResponseDto> {
    if (!bulkDto.records || bulkDto.records.length === 0) {
      throw new BadRequestException('No attendance records provided');
    }

    // Create a session first
    const sessionDto: CreateAttendanceSessionDto = {
      classId: bulkDto.classId,
      sectionId: bulkDto.sectionId,
      date: bulkDto.date,
      type: bulkDto.type || AttendanceType.DAILY,
      subjectId: bulkDto.subjectId,
      eventId: bulkDto.eventId,
      notes: bulkDto.notes,
      status: AttendanceSessionStatus.COMPLETED,
      attendanceRecords: bulkDto.records,
    };

    return this.createAttendanceSession(sessionDto, userId);
  }

  async getAttendanceStatistics(
    classId: string,
    sectionId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const where: FindOptionsWhere<AttendanceRecord> = { classId };

    if (sectionId) {
      where.sectionId = sectionId;
    }

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    }

    const records = await this.attendanceRecordRepository.find({ where });

    // Calculate statistics
    const totalRecords = records.length;
    const presentCount = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absentCount = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const lateCount = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const excusedCount = records.filter((r) => r.status === AttendanceStatus.EXCUSED).length;
    const halfDayCount = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;

    // Calculate percentages
    const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    const absentPercentage = totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0;
    const latePercentage = totalRecords > 0 ? (lateCount / totalRecords) * 100 : 0;
    const excusedPercentage = totalRecords > 0 ? (excusedCount / totalRecords) * 100 : 0;
    const halfDayPercentage = totalRecords > 0 ? (halfDayCount / totalRecords) * 100 : 0;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      halfDayCount,
      presentPercentage,
      absentPercentage,
      latePercentage,
      excusedPercentage,
      halfDayPercentage,
    };
  }

  async getStudentAttendanceReport(
    studentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const where: FindOptionsWhere<AttendanceRecord> = { studentId };

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    }

    const records = await this.attendanceRecordRepository.find({
      where,
      order: { date: 'ASC' },
    });

    // Calculate statistics
    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absentDays = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const lateDays = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const excusedDays = records.filter((r) => r.status === AttendanceStatus.EXCUSED).length;
    const halfDays = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;

    // Calculate attendance percentage
    const attendancePercentage =
      totalDays > 0 ? ((presentDays + lateDays + halfDays * 0.5) / totalDays) * 100 : 0;

    return {
      studentId,
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      excusedDays,
      halfDays,
      attendancePercentage,
      records: records.map((record) => this.mapToAttendanceRecordResponseDto(record)),
    };
  }

  // Helper Methods
  private calculateAttendanceCounts(records: CreateAttendanceRecordDto[]): {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    halfDay: number;
  } {
    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const late = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const excused = records.filter((r) => r.status === AttendanceStatus.EXCUSED).length;
    const halfDay = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;

    return {
      total,
      present,
      absent,
      late,
      excused,
      halfDay,
    };
  }

  private mapToAttendanceRecordResponseDto(record: AttendanceRecord): AttendanceRecordResponseDto {
    const response: AttendanceRecordResponseDto = {
      id: record.id,
      studentId: record.studentId,
      classId: record.classId,
      sectionId: record.sectionId,
      date: record.date,
      status: record.status,
      type: record.type,
      subjectId: record.subjectId,
      eventId: record.eventId,
      timeIn: record.timeIn,
      timeOut: record.timeOut,
      remarks: record.remarks,
      notified: record.notified,
      notifiedAt: record.notifiedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    // Add related entities if available
    if (record.student) {
      response.student = {
        id: record.student.id,
        firstName: record.student.firstName,
        lastName: record.student.lastName,
        admissionNumber: record.student.admissionNumber,
      };
    }

    if (record.class) {
      response.class = {
        id: record.class.id,
        name: record.class.name,
        grade: record.class.grade,
      };
    }

    if (record.section) {
      response.section = {
        id: record.section.id,
        name: record.section.name,
      };
    }

    if (record.creator) {
      response.creator = {
        id: record.creator.id,
        fullName: `${record.creator.firstName} ${record.creator.lastName}`,
      };
    }

    return response;
  }

  private mapToAttendanceSessionResponseDto(
    session: AttendanceSession,
  ): AttendanceSessionResponseDto {
    const response: AttendanceSessionResponseDto = {
      id: session.id,
      classId: session.classId,
      sectionId: session.sectionId,
      date: session.date,
      type: session.type,
      subjectId: session.subjectId,
      eventId: session.eventId,
      status: session.status,
      notes: session.notes,
      totalStudents: session.totalStudents,
      presentCount: session.presentCount,
      absentCount: session.absentCount,
      lateCount: session.lateCount,
      excusedCount: session.excusedCount,
      halfDayCount: session.halfDayCount,
      createdBy: session.createdBy,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };

    // Add related entities if available
    if (session.class) {
      response.class = {
        id: session.class.id,
        name: session.class.name,
        grade: session.class.grade,
      };
    }

    if (session.section) {
      response.section = {
        id: session.section.id,
        name: session.section.name,
      };
    }

    if (session.creator) {
      response.creator = {
        id: session.creator.id,
        fullName: `${session.creator.firstName} ${session.creator.lastName}`,
      };
    }

    return response;
  }
}

