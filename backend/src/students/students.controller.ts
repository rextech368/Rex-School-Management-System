import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Request,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto, StudentFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StudentResponseDto } from './dto/student-response.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Students')
@Controller('api/v1/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher', 'Finance Admin')
  @ApiOperation({ summary: 'Get all students with filtering options' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns a list of students with pagination metadata',
    type: StudentResponseDto,
    isArray: true
  })
  async findAll(@Query() filterDto: StudentFilterDto) {
    const result = await this.studentsService.findAll(filterDto);
    return {
      ...result,
      data: result.data.map(student => plainToClass(StudentResponseDto, student)),
    };
  }

  @Get('stats')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Get student statistics' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns student statistics'
  })
  getStudentStats() {
    return this.studentsService.getStudentStats();
  }

  @Get(':id')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher', 'Finance Admin', 'Parent', 'Student')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the student details',
    type: StudentResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const student = await this.studentsService.findOne(id);
    return plainToClass(StudentResponseDto, student);
  }

  @Get('admission/:admissionNumber')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher', 'Finance Admin')
  @ApiOperation({ summary: 'Get a student by admission number' })
  @ApiParam({ name: 'admissionNumber', description: 'Student admission number' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the student details',
    type: StudentResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found' })
  async findByAdmissionNumber(@Param('admissionNumber') admissionNumber: string) {
    const student = await this.studentsService.findByAdmissionNumber(admissionNumber);
    return plainToClass(StudentResponseDto, student);
  }

  @Post()
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Student created successfully',
    type: StudentResponseDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Student with this admission number already exists' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateStudentDto, @Request() req) {
    const student = await this.studentsService.create(dto, req.user?.id);
    return plainToClass(StudentResponseDto, student);
  }

  @Post('bulk')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create multiple students' })
  @ApiBody({ type: [CreateStudentDto] })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Students created successfully'
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  bulkCreate(@Body() dtos: CreateStudentDto[], @Request() req) {
    return this.studentsService.bulkCreate(dtos, req.user?.id);
  }

  @Put(':id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Student updated successfully',
    type: StudentResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateStudentDto,
    @Request() req
  ) {
    const student = await this.studentsService.update(id, dto, req.user?.id);
    return plainToClass(StudentResponseDto, student);
  }

  @Put('bulk')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Update multiple students' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'Array of student IDs'
        },
        data: {
          type: 'object',
          description: 'Student data to update'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Students updated successfully'
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  bulkUpdate(
    @Body('ids') ids: string[], 
    @Body('data') dto: UpdateStudentDto,
    @Request() req
  ) {
    return this.studentsService.bulkUpdate(ids, dto, req.user?.id);
  }

  @Delete(':id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Student deleted successfully'
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.studentsService.remove(id, req.user?.id);
  }

  @Get('class/:classId')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Get students by class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns students in the specified class',
    type: StudentResponseDto,
    isArray: true
  })
  async getStudentsByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    const students = await this.studentsService.getStudentsByClass(classId);
    return students.map(student => plainToClass(StudentResponseDto, student));
  }

  @Get('section/:sectionId')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Get students by section' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns students in the specified section',
    type: StudentResponseDto,
    isArray: true
  })
  async getStudentsBySection(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    const students = await this.studentsService.getStudentsBySection(sectionId);
    return students.map(student => plainToClass(StudentResponseDto, student));
  }

  @Get('academic-year/:academicYearId')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Get students by academic year' })
  @ApiParam({ name: 'academicYearId', description: 'Academic Year ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns students in the specified academic year',
    type: StudentResponseDto,
    isArray: true
  })
  async getStudentsByAcademicYear(@Param('academicYearId', ParseUUIDPipe) academicYearId: string) {
    const students = await this.studentsService.getStudentsByAcademicYear(academicYearId);
    return students.map(student => plainToClass(StudentResponseDto, student));
  }

  @Post('promote')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Promote students to a new class/section/academic year' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        studentIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'Array of student IDs to promote'
        },
        targetClassId: {
          type: 'string',
          format: 'uuid',
          description: 'Target class ID'
        },
        targetSectionId: {
          type: 'string',
          format: 'uuid',
          description: 'Target section ID'
        },
        targetAcademicYearId: {
          type: 'string',
          format: 'uuid',
          description: 'Target academic year ID'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Students promoted successfully'
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  promoteStudents(
    @Body('studentIds') studentIds: string[],
    @Body('targetClassId') targetClassId: string,
    @Body('targetSectionId') targetSectionId: string,
    @Body('targetAcademicYearId') targetAcademicYearId: string,
    @Request() req
  ) {
    return this.studentsService.promoteStudents(
      studentIds, 
      targetClassId, 
      targetSectionId, 
      targetAcademicYearId,
      req.user?.id
    );
  }

  @Post('graduate')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Graduate students' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        studentIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'Array of student IDs to graduate'
        },
        graduationDate: {
          type: 'string',
          format: 'date',
          description: 'Graduation date'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Students graduated successfully'
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  graduateStudents(
    @Body('studentIds') studentIds: string[],
    @Body('graduationDate') graduationDate: string,
    @Request() req
  ) {
    return this.studentsService.graduateStudents(
      studentIds, 
      new Date(graduationDate),
      req.user?.id
    );
  }
}

