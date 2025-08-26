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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentsService } from '../services/students.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
  StudentFilterDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { StudentStatus } from '../entities/student.entity';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The student has been successfully created.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createStudentDto: CreateStudentDto, @Request() req): Promise<StudentResponseDto> {
    const student = await this.studentsService.create(createStudentDto, req.user.id);
    return this.mapToResponseDto(student);
  }

  @Get()
  @Roles('admin', 'registrar', 'teacher', 'parent')
  @ApiOperation({ summary: 'Get all students with filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all students.',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(@Query() filterDto: StudentFilterDto): Promise<{ data: StudentResponseDto[]; total: number }> {
    const [students, total] = await this.studentsService.findAll(filterDto);
    return {
      data: students.map(student => this.mapToResponseDto(student)),
      total,
    };
  }

  @Get(':id')
  @Roles('admin', 'registrar', 'teacher', 'parent', 'student')
  @ApiOperation({ summary: 'Get a student by id' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the student.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    const student = await this.studentsService.findOne(id);
    return this.mapToResponseDto(student);
  }

  @Get('admission/:admissionNumber')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get a student by admission number' })
  @ApiParam({ name: 'admissionNumber', description: 'Student admission number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the student.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findByAdmissionNumber(@Param('admissionNumber') admissionNumber: string): Promise<StudentResponseDto> {
    const student = await this.studentsService.findByAdmissionNumber(admissionNumber);
    return this.mapToResponseDto(student);
  }

  @Patch(':id')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully updated.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Request() req,
  ): Promise<StudentResponseDto> {
    const student = await this.studentsService.update(id, updateStudentDto, req.user.id);
    return this.mapToResponseDto(student);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The student has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.studentsService.remove(id, req.user.id);
  }

  @Post(':id/restore')
  @Roles('admin')
  @ApiOperation({ summary: 'Restore a deleted student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully restored.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Student is not deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async restore(@Param('id') id: string): Promise<StudentResponseDto> {
    const student = await this.studentsService.restore(id);
    return this.mapToResponseDto(student);
  }

  @Patch(':id/status')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Update student status' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(StudentStatus),
          description: 'Student status',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student status has been successfully updated.',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: StudentStatus,
    @Request() req,
  ): Promise<StudentResponseDto> {
    const student = await this.studentsService.updateStudentStatus(id, status, req.user.id);
    return this.mapToResponseDto(student);
  }

  @Post('bulk-delete')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete multiple students' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Array of student IDs to delete',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The students have been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkDelete(@Body('ids') ids: string[], @Request() req): Promise<void> {
    await this.studentsService.bulkDelete(ids, req.user.id);
  }

  @Post('bulk-update-status')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Update status for multiple students' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Array of student IDs to update',
        },
        status: {
          type: 'string',
          enum: Object.values(StudentStatus),
          description: 'Student status',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'The students status has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkUpdateStatus(
    @Body('ids') ids: string[],
    @Body('status') status: StudentStatus,
    @Request() req,
  ): Promise<{ success: boolean }> {
    await this.studentsService.bulkUpdateStatus(ids, status, req.user.id);
    return { success: true };
  }

  @Get('class/:classId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get students by class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return students in the class.',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getStudentsByClass(@Param('classId') classId: string): Promise<StudentResponseDto[]> {
    const students = await this.studentsService.getStudentsByClass(classId);
    return students.map(student => this.mapToResponseDto(student));
  }

  @Get('section/:sectionId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get students by section' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return students in the section.',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getStudentsBySection(@Param('sectionId') sectionId: string): Promise<StudentResponseDto[]> {
    const students = await this.studentsService.getStudentsBySection(sectionId);
    return students.map(student => this.mapToResponseDto(student));
  }

  @Get('academic-year/:academicYearId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get students by academic year' })
  @ApiParam({ name: 'academicYearId', description: 'Academic Year ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return students in the academic year.',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getStudentsByAcademicYear(@Param('academicYearId') academicYearId: string): Promise<StudentResponseDto[]> {
    const students = await this.studentsService.getStudentsByAcademicYear(academicYearId);
    return students.map(student => this.mapToResponseDto(student));
  }

  @Get('statistics')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Get student statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return student statistics.',
    schema: {
      type: 'object',
      properties: {
        totalStudents: { type: 'number' },
        activeStudents: { type: 'number' },
        inactiveStudents: { type: 'number' },
        graduatedStudents: { type: 'number' },
        transferredStudents: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getStatistics(): Promise<any> {
    return this.studentsService.getStudentStatistics();
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(student: any): StudentResponseDto {
    const responseDto = new StudentResponseDto();
    Object.assign(responseDto, student);
    return responseDto;
  }
}

