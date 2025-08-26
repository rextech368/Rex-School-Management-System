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
import { ParentsService } from './parents.service';
import { CreateParentDto, UpdateParentDto, ParentFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Parents')
@Controller('api/v1/parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Create a new parent' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The parent has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  create(@Body() createParentDto: CreateParentDto, @Request() req) {
    return this.parentsService.create(createParentDto, req.user.id);
  }

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get all parents with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all parents.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAll(@Query() filterDto: ParentFilterDto) {
    return this.parentsService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get a parent by ID' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the parent.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentsService.findOne(id);
  }

  @Get('email/:email')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get a parent by email' })
  @ApiParam({ name: 'email', description: 'Parent email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the parent.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findByEmail(@Param('email') email: string) {
    return this.parentsService.findByEmail(email);
  }

  @Patch(':id')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Update a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The parent has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParentDto: UpdateParentDto,
    @Request() req,
  ) {
    return this.parentsService.update(id, updateParentDto, req.user.id);
  }

  @Delete(':id')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Delete a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The parent has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.parentsService.remove(id, req.user.id);
  }

  @Post('bulk')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Create multiple parents' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The parents have been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  bulkCreate(@Body() createParentDtos: CreateParentDto[], @Request() req) {
    return this.parentsService.bulkCreate(createParentDtos, req.user.id);
  }

  @Get('student/:studentId')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Teacher')
  @ApiOperation({ summary: 'Get parents by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the parents for the student.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getParentsByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.parentsService.getParentsByStudent(studentId);
  }

  @Get('stats/overview')
  @Roles('Admin', 'Principal')
  @ApiOperation({ summary: 'Get parent statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return parent statistics.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getParentStats() {
    return this.parentsService.getParentStats();
  }
}

