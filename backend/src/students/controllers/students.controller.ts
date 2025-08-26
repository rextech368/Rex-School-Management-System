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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { CreateGuardianDto } from '../dto/create-guardian.dto';
import { UpdateGuardianDto } from '../dto/update-guardian.dto';
import { CreateStudentDocumentDto } from '../dto/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/update-student-document.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { Student } from '../entities/student.entity';
import { Guardian } from '../entities/guardian.entity';
import { StudentDocument } from '../entities/student-document.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/enums/role.enum';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.createStudent(createStudentDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER)
  @ApiOperation({ summary: 'Find all students with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of students.',
    type: [Student],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findAll(@Query() filterDto: StudentFilterDto): Promise<Student[]> {
    return this.studentsService.findAllStudents(filterDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student details.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findStudentById(id);
  }

  @Get('by-student-id/:studentId')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find student by student ID (school-specific ID)' })
  @ApiParam({ name: 'studentId', description: 'School-specific student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student details.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findByStudentId(@Param('studentId') studentId: string): Promise<Student> {
    return this.studentsService.findStudentByStudentId(studentId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully updated.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentsService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully deleted.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  remove(@Param('id') id: string): Promise<Student> {
    return this.studentsService.removeStudent(id);
  }

  @Post(':id/guardians')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Add guardian to student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: CreateGuardianDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The guardian has been successfully added to the student.',
    type: Guardian,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  addGuardian(
    @Param('id') id: string,
    @Body() createGuardianDto: CreateGuardianDto,
  ): Promise<Guardian> {
    return this.studentsService.addGuardianToStudent(id, createGuardianDto);
  }

  @Get('guardians/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find guardian by ID' })
  @ApiParam({ name: 'id', description: 'Guardian ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guardian details.',
    type: Guardian,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Guardian not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findGuardian(@Param('id') id: string): Promise<Guardian> {
    return this.studentsService.findGuardianById(id);
  }

  @Patch('guardians/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update guardian' })
  @ApiParam({ name: 'id', description: 'Guardian ID' })
  @ApiBody({ type: UpdateGuardianDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The guardian has been successfully updated.',
    type: Guardian,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Guardian not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  updateGuardian(
    @Param('id') id: string,
    @Body() updateGuardianDto: UpdateGuardianDto,
  ): Promise<Guardian> {
    return this.studentsService.updateGuardian(id, updateGuardianDto);
  }

  @Delete('guardians/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete guardian' })
  @ApiParam({ name: 'id', description: 'Guardian ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The guardian has been successfully deleted.',
    type: Guardian,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Guardian not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  removeGuardian(@Param('id') id: string): Promise<Guardian> {
    return this.studentsService.removeGuardian(id);
  }

  @Delete(':studentId/guardians/:guardianId')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Remove guardian from student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'guardianId', description: 'Guardian ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The guardian has been successfully removed from the student.',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student or guardian not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Guardian is not associated with student.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  removeGuardianFromStudent(
    @Param('studentId') studentId: string,
    @Param('guardianId') guardianId: string,
  ): Promise<Student> {
    return this.studentsService.removeGuardianFromStudent(studentId, guardianId);
  }

  @Post('documents')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Add document to student' })
  @ApiBody({ type: CreateStudentDocumentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The document has been successfully added to the student.',
    type: StudentDocument,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  addDocument(
    @Body() createStudentDocumentDto: CreateStudentDocumentDto,
  ): Promise<StudentDocument> {
    return this.studentsService.addDocumentToStudent(createStudentDocumentDto);
  }

  @Get(':id/documents')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find all documents for a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of documents.',
    type: [StudentDocument],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findAllDocuments(@Param('id') id: string): Promise<StudentDocument[]> {
    return this.studentsService.findAllDocumentsForStudent(id);
  }

  @Get('documents/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document details.',
    type: StudentDocument,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  findDocument(@Param('id') id: string): Promise<StudentDocument> {
    return this.studentsService.findDocumentById(id);
  }

  @Patch('documents/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({ type: UpdateStudentDocumentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document has been successfully updated.',
    type: StudentDocument,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  updateDocument(
    @Param('id') id: string,
    @Body() updateStudentDocumentDto: UpdateStudentDocumentDto,
  ): Promise<StudentDocument> {
    return this.studentsService.updateDocument(id, updateStudentDocumentDto);
  }

  @Delete('documents/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Delete document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document has been successfully deleted.',
    type: StudentDocument,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  removeDocument(@Param('id') id: string): Promise<StudentDocument> {
    return this.studentsService.removeDocument(id);
  }
}

