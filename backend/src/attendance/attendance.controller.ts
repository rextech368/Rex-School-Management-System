import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
  CreateAttendanceSessionDto,
  UpdateAttendanceSessionDto,
  AttendanceFilterDto,
  BulkAttendanceRecordsDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Attendance Records Endpoints
  @Post('records')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'The attendance record has been created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAttendanceRecordDto })
  createAttendanceRecord(@Body() createAttendanceRecordDto: CreateAttendanceRecordDto, @Request() req) {
    return this.attendanceService.createAttendanceRecord(createAttendanceRecordDto, req.user.id);
  }

  @Get('records')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all attendance records with filtering' })
  @ApiResponse({ status: 200, description: 'Return all attendance records.' })
  findAllAttendanceRecords(@Query() filterDto: AttendanceFilterDto) {
    return this.attendanceService.findAllAttendanceRecords(filterDto);
  }

  @Get('records/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get a specific attendance record by ID' })
  @ApiResponse({ status: 200, description: 'Return the attendance record.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  findOneAttendanceRecord(@Param('id') id: string) {
    return this.attendanceService.findOneAttendanceRecord(id);
  }

  @Patch('records/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({ status: 200, description: 'The attendance record has been updated successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiBody({ type: UpdateAttendanceRecordDto })
  updateAttendanceRecord(
    @Param('id') id: string,
    @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto,
    @Request() req,
  ) {
    return this.attendanceService.updateAttendanceRecord(id, updateAttendanceRecordDto, req.user.id);
  }

  @Delete('records/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 200, description: 'The attendance record has been deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  removeAttendanceRecord(@Param('id') id: string, @Request() req) {
    return this.attendanceService.removeAttendanceRecord(id, req.user.id);
  }

  // Attendance Sessions Endpoints
  @Post('sessions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new attendance session' })
  @ApiResponse({ status: 201, description: 'The attendance session has been created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAttendanceSessionDto })
  createAttendanceSession(@Body() createAttendanceSessionDto: CreateAttendanceSessionDto, @Request() req) {
    return this.attendanceService.createAttendanceSession(createAttendanceSessionDto, req.user.id);
  }

  @Get('sessions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all attendance sessions with filtering' })
  @ApiResponse({ status: 200, description: 'Return all attendance sessions.' })
  findAllAttendanceSessions(@Query() filterDto: AttendanceFilterDto) {
    return this.attendanceService.findAllAttendanceSessions(filterDto);
  }

  @Get('sessions/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get a specific attendance session by ID' })
  @ApiResponse({ status: 200, description: 'Return the attendance session.' })
  @ApiResponse({ status: 404, description: 'Attendance session not found.' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  findOneAttendanceSession(@Param('id') id: string) {
    return this.attendanceService.findOneAttendanceSession(id);
  }

  @Patch('sessions/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update an attendance session' })
  @ApiResponse({ status: 200, description: 'The attendance session has been updated successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance session not found.' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  @ApiBody({ type: UpdateAttendanceSessionDto })
  updateAttendanceSession(
    @Param('id') id: string,
    @Body() updateAttendanceSessionDto: UpdateAttendanceSessionDto,
    @Request() req,
  ) {
    return this.attendanceService.updateAttendanceSession(id, updateAttendanceSessionDto, req.user.id);
  }

  @Delete('sessions/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an attendance session' })
  @ApiResponse({ status: 200, description: 'The attendance session has been deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance session not found.' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  removeAttendanceSession(@Param('id') id: string, @Request() req) {
    return this.attendanceService.removeAttendanceSession(id, req.user.id);
  }

  // Bulk Operations
  @Post('bulk')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create bulk attendance records' })
  @ApiResponse({ status: 201, description: 'The attendance records have been created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: BulkAttendanceRecordsDto })
  createBulkAttendanceRecords(@Body() bulkDto: BulkAttendanceRecordsDto, @Request() req) {
    return this.attendanceService.createBulkAttendanceRecords(bulkDto, req.user.id);
  }

  // Statistics and Reports
  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get attendance statistics for a class/section' })
  @ApiResponse({ status: 200, description: 'Return attendance statistics.' })
  @ApiQuery({ name: 'classId', required: true, description: 'Class ID' })
  @ApiQuery({ name: 'sectionId', required: false, description: 'Section ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  getAttendanceStatistics(
    @Query('classId') classId: string,
    @Query('sectionId') sectionId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.attendanceService.getAttendanceStatistics(classId, sectionId, startDate, endDate);
  }

  @Get('student-report/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get attendance report for a student' })
  @ApiResponse({ status: 200, description: 'Return student attendance report.' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  getStudentAttendanceReport(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.attendanceService.getStudentAttendanceReport(studentId, startDate, endDate);
  }
}

