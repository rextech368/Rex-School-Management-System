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
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import {
  CreateClassDto,
  UpdateClassDto,
  ClassFilterDto,
  CreateSectionDto,
  UpdateSectionDto,
  SectionFilterDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Classes')
@Controller('api/v1/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // Class Endpoints
  @Post()
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The class has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createClass(@Body() createClassDto: CreateClassDto, @Request() req) {
    return this.classesService.createClass(createClassDto, req.user.id);
  }

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get all classes with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all classes.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAllClasses(@Query() filterDto: ClassFilterDto) {
    return this.classesService.findAllClasses(filterDto);
  }

  @Get(':id')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get a class by ID' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the class.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Class not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findClassById(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findClassById(id);
  }

  @Patch(':id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Update a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The class has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Class not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  updateClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Request() req,
  ) {
    return this.classesService.updateClass(id, updateClassDto, req.user.id);
  }

  @Delete(':id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The class has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Class not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  removeClass(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.classesService.removeClass(id, req.user.id);
  }

  // Section Endpoints
  @Post('sections')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The section has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createSection(@Body() createSectionDto: CreateSectionDto, @Request() req) {
    return this.classesService.createSection(createSectionDto, req.user.id);
  }

  @Get('sections')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get all sections with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all sections.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAllSections(@Query() filterDto: SectionFilterDto) {
    return this.classesService.findAllSections(filterDto);
  }

  @Get('sections/:id')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get a section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the section.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Section not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findSectionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findSectionById(id);
  }

  @Patch('sections/:id')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Update a section' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The section has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Section not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  updateSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
    @Request() req,
  ) {
    return this.classesService.updateSection(id, updateSectionDto, req.user.id);
  }

  @Delete('sections/:id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Delete a section' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The section has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Section not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  removeSection(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.classesService.removeSection(id, req.user.id);
  }

  // Student Enrollment Endpoints
  @Post('sections/:sectionId/students/:studentId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Enroll a student in a section' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully enrolled.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Section or student not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  enrollStudentInSection(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req,
  ) {
    return this.classesService.enrollStudentInSection(studentId, sectionId, req.user.id);
  }

  @Delete('students/:studentId/enrollment')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Remove a student from their current section' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully removed from the section.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  removeStudentFromSection(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req,
  ) {
    return this.classesService.removeStudentFromSection(studentId, req.user.id);
  }

  // Bulk Operations
  @Post('bulk')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create multiple classes' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The classes have been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  bulkCreateClasses(@Body() createClassDtos: CreateClassDto[], @Request() req) {
    return this.classesService.bulkCreateClasses(createClassDtos, req.user.id);
  }

  @Post('sections/bulk')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create multiple sections' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The sections have been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  bulkCreateSections(@Body() createSectionDtos: CreateSectionDto[], @Request() req) {
    return this.classesService.bulkCreateSections(createSectionDtos, req.user.id);
  }

  // Statistics
  @Get('stats/overview')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Get class statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return class statistics.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getClassStats() {
    return this.classesService.getClassStats();
  }
}

