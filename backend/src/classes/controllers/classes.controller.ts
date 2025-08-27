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
import { ClassesService } from '../services/classes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/enums/role.enum';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateClassDto,
  UpdateClassDto,
  CreateTermDto,
  UpdateTermDto,
  CreateClassScheduleDto,
  UpdateClassScheduleDto,
  CourseFilterDto,
  ClassFilterDto,
  TermFilterDto,
  EnrollStudentsDto,
} from '../dto';
import { Course } from '../entities/course.entity';
import { Class } from '../entities/class.entity';
import { Term } from '../entities/term.entity';
import { ClassSchedule } from '../entities/class-schedule.entity';

@ApiTags('classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  /**
   * Course Management
   */
  @Post('courses')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The course has been successfully created.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Course with this code already exists.',
  })
  createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.classesService.createCourse(createCourseDto);
  }

  @Get('courses')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find all courses with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of courses.',
    type: [Course],
  })
  findAllCourses(@Query() filterDto: CourseFilterDto): Promise<Course[]> {
    return this.classesService.findAllCourses(filterDto);
  }

  @Get('courses/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course details.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  findCourseById(@Param('id') id: string): Promise<Course> {
    return this.classesService.findCourseById(id);
  }

  @Get('courses/code/:code')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find course by code' })
  @ApiParam({ name: 'code', description: 'Course code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course details.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  findCourseByCode(@Param('code') code: string): Promise<Course> {
    return this.classesService.findCourseByCode(code);
  }

  @Patch('courses/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The course has been successfully updated.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Course with this code already exists.',
  })
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.classesService.updateCourse(id, updateCourseDto);
  }

  @Delete('courses/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The course has been successfully deleted.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete course with existing classes.',
  })
  removeCourse(@Param('id') id: string): Promise<Course> {
    return this.classesService.removeCourse(id);
  }

  /**
   * Term Management
   */
  @Post('terms')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new term' })
  @ApiBody({ type: CreateTermDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The term has been successfully created.',
    type: Term,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  createTerm(@Body() createTermDto: CreateTermDto): Promise<Term> {
    return this.classesService.createTerm(createTermDto);
  }

  @Get('terms')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find all terms with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of terms.',
    type: [Term],
  })
  findAllTerms(@Query() filterDto: TermFilterDto): Promise<Term[]> {
    return this.classesService.findAllTerms(filterDto);
  }

  @Get('terms/current')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find current term' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current term details.',
    type: Term,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No current term found.',
  })
  findCurrentTerm(): Promise<Term> {
    return this.classesService.findCurrentTerm();
  }

  @Get('terms/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find term by ID' })
  @ApiParam({ name: 'id', description: 'Term ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Term details.',
    type: Term,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Term not found.',
  })
  findTermById(@Param('id') id: string): Promise<Term> {
    return this.classesService.findTermById(id);
  }

  @Patch('terms/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update term' })
  @ApiParam({ name: 'id', description: 'Term ID' })
  @ApiBody({ type: UpdateTermDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The term has been successfully updated.',
    type: Term,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Term not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  updateTerm(
    @Param('id') id: string,
    @Body() updateTermDto: UpdateTermDto,
  ): Promise<Term> {
    return this.classesService.updateTerm(id, updateTermDto);
  }

  @Delete('terms/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete term' })
  @ApiParam({ name: 'id', description: 'Term ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The term has been successfully deleted.',
    type: Term,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Term not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete term with existing classes.',
  })
  removeTerm(@Param('id') id: string): Promise<Term> {
    return this.classesService.removeTerm(id);
  }

  /**
   * Class Management
   */
  @Post()
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The class has been successfully created.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Class with this code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course, term, or teacher not found.',
  })
  createClass(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.createClass(createClassDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find all classes with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of classes.',
    type: [Class],
  })
  findAllClasses(@Query() filterDto: ClassFilterDto): Promise<Class[]> {
    return this.classesService.findAllClasses(filterDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find class by ID' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class details.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found.',
  })
  findClassById(@Param('id') id: string): Promise<Class> {
    return this.classesService.findClassById(id);
  }

  @Get('code/:code')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find class by code' })
  @ApiParam({ name: 'code', description: 'Class code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class details.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found.',
  })
  findClassByCode(@Param('code') code: string): Promise<Class> {
    return this.classesService.findClassByCode(code);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The class has been successfully updated.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class, course, term, or teacher not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Class with this code already exists.',
  })
  updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The class has been successfully deleted.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete class with enrolled students.',
  })
  removeClass(@Param('id') id: string): Promise<Class> {
    return this.classesService.removeClass(id);
  }

  /**
   * Class Schedule Management
   */
  @Post(':id/schedules')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new class schedule' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiBody({ type: CreateClassScheduleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The schedule has been successfully created.',
    type: ClassSchedule,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Schedule conflicts with existing class in the same room/building.',
  })
  createSchedule(
    @Param('id') id: string,
    @Body() createClassScheduleDto: CreateClassScheduleDto,
  ): Promise<ClassSchedule> {
    // Override classId from path parameter
    createClassScheduleDto.classId = id;
    return this.classesService.createClassSchedule(createClassScheduleDto);
  }

  @Get(':id/schedules')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find all schedules for a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of schedules.',
    type: [ClassSchedule],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found.',
  })
  findSchedulesByClassId(@Param('id') id: string): Promise<ClassSchedule[]> {
    return this.classesService.findSchedulesByClassId(id);
  }

  @Get('schedules/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @ApiOperation({ summary: 'Find schedule by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule details.',
    type: ClassSchedule,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found.',
  })
  findScheduleById(@Param('id') id: string): Promise<ClassSchedule> {
    return this.classesService.findScheduleById(id);
  }

  @Patch('schedules/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiBody({ type: UpdateClassScheduleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The schedule has been successfully updated.',
    type: ClassSchedule,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Schedule conflicts with existing class in the same room/building.',
  })
  updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateClassScheduleDto,
  ): Promise<ClassSchedule> {
    return this.classesService.updateSchedule(id, updateScheduleDto);
  }

  @Delete('schedules/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The schedule has been successfully deleted.',
    type: ClassSchedule,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found.',
  })
  removeSchedule(@Param('id') id: string): Promise<ClassSchedule> {
    return this.classesService.removeSchedule(id);
  }

  /**
   * Student Enrollment Management
   */
  @Post(':id/enroll')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Enroll students in a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiBody({ type: EnrollStudentsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Students have been successfully enrolled.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class or student not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Class is at maximum capacity or students are already enrolled.',
  })
  enrollStudents(
    @Param('id') id: string,
    @Body() enrollStudentsDto: EnrollStudentsDto,
  ): Promise<Class> {
    return this.classesService.enrollStudents(id, enrollStudentsDto);
  }

  @Delete(':id/students/:studentId')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Unenroll a student from a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student has been successfully unenrolled.',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class or student not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Student is not enrolled in this class.',
  })
  unenrollStudent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<Class> {
    return this.classesService.unenrollStudent(id, studentId);
  }
}

