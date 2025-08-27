import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { BulkCreateAttendanceDto } from '../dto/bulk-create-attendance.dto';
import { AttendanceFilterDto } from '../dto/attendance-filter.dto';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The attendance record has been successfully created.',
    type: AttendanceRecord,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<AttendanceRecord> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('bulk')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create multiple attendance records in bulk' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The attendance records have been successfully created.',
    type: [AttendanceRecord],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  bulkCreate(@Body() bulkCreateAttendanceDto: BulkCreateAttendanceDto): Promise<AttendanceRecord[]> {
    return this.attendanceService.bulkCreate(bulkCreateAttendanceDto);
  }

  @Get()
  @Roles('admin', 'teacher', 'guardian')
  @ApiOperation({ summary: 'Get all attendance records with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all attendance records matching the criteria.',
    type: [AttendanceRecord],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAll(@Query() filterDto: AttendanceFilterDto): Promise<AttendanceRecord[]> {
    return this.attendanceService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'guardian')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the attendance record.',
    type: AttendanceRecord,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Attendance record not found.' })
  findOne(@Param('id') id: string): Promise<AttendanceRecord> {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The attendance record has been successfully updated.',
    type: AttendanceRecord,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Attendance record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The attendance record has been successfully deleted.',
    type: AttendanceRecord,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Attendance record not found.' })
  remove(@Param('id') id: string): Promise<AttendanceRecord> {
    return this.attendanceService.remove(id);
  }

  @Get('statistics/student/:studentId')
  @Roles('admin', 'teacher', 'guardian')
  @ApiOperation({ summary: 'Get attendance statistics for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', required: true })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns attendance statistics for the student.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  getStudentStatistics(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<any> {
    return this.attendanceService.getStudentStatistics(studentId, startDate, endDate);
  }
}

