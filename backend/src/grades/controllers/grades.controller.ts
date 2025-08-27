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
import { GradesService } from '../services/grades.service';
import { CreateGradeItemDto } from '../dto/create-grade-item.dto';
import { UpdateGradeItemDto } from '../dto/update-grade-item.dto';
import { CreateGradeEntryDto } from '../dto/create-grade-entry.dto';
import { UpdateGradeEntryDto } from '../dto/update-grade-entry.dto';
import { BulkCreateGradeEntriesDto } from '../dto/bulk-create-grade-entries.dto';
import { GradeFilterDto } from '../dto/grade-filter.dto';
import { CreateGradeTemplateDto } from '../dto/create-grade-template.dto';
import { UpdateGradeTemplateDto } from '../dto/update-grade-template.dto';
import { GradeItem } from '../entities/grade-item.entity';
import { GradeEntry } from '../entities/grade-entry.entity';
import { GradeTemplate } from '../entities/grade-template.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('grades')
@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('items')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new grade item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The grade item has been successfully created.',
    type: GradeItem,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createGradeItem(@Body() createGradeItemDto: CreateGradeItemDto): Promise<GradeItem> {
    return this.gradesService.createGradeItem(createGradeItemDto);
  }

  @Get('items')
  @Roles('admin', 'teacher', 'student', 'guardian')
  @ApiOperation({ summary: 'Get all grade items with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all grade items matching the criteria.',
    type: [GradeItem],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAllGradeItems(@Query() filterDto: GradeFilterDto): Promise<GradeItem[]> {
    return this.gradesService.findAllGradeItems(filterDto);
  }

  @Get('items/:id')
  @Roles('admin', 'teacher', 'student', 'guardian')
  @ApiOperation({ summary: 'Get grade item by ID' })
  @ApiParam({ name: 'id', description: 'Grade item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the grade item.',
    type: GradeItem,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade item not found.' })
  findGradeItemById(@Param('id') id: string): Promise<GradeItem> {
    return this.gradesService.findGradeItemById(id);
  }

  @Patch('items/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update grade item' })
  @ApiParam({ name: 'id', description: 'Grade item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade item has been successfully updated.',
    type: GradeItem,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade item not found.' })
  updateGradeItem(
    @Param('id') id: string,
    @Body() updateGradeItemDto: UpdateGradeItemDto,
  ): Promise<GradeItem> {
    return this.gradesService.updateGradeItem(id, updateGradeItemDto);
  }

  @Delete('items/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Delete grade item' })
  @ApiParam({ name: 'id', description: 'Grade item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade item has been successfully deleted.',
    type: GradeItem,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade item not found.' })
  removeGradeItem(@Param('id') id: string): Promise<GradeItem> {
    return this.gradesService.removeGradeItem(id);
  }

  @Post('entries')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new grade entry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The grade entry has been successfully created.',
    type: GradeEntry,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createGradeEntry(@Body() createGradeEntryDto: CreateGradeEntryDto): Promise<GradeEntry> {
    return this.gradesService.createGradeEntry(createGradeEntryDto);
  }

  @Post('entries/bulk')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create multiple grade entries in bulk' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The grade entries have been successfully created.',
    type: [GradeEntry],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  bulkCreateGradeEntries(@Body() bulkCreateGradeEntriesDto: BulkCreateGradeEntriesDto): Promise<GradeEntry[]> {
    return this.gradesService.bulkCreateGradeEntries(bulkCreateGradeEntriesDto);
  }

  @Get('entries')
  @Roles('admin', 'teacher', 'student', 'guardian')
  @ApiOperation({ summary: 'Get all grade entries with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all grade entries matching the criteria.',
    type: [GradeEntry],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAllGradeEntries(@Query() filterDto: GradeFilterDto): Promise<GradeEntry[]> {
    return this.gradesService.findAllGradeEntries(filterDto);
  }

  @Get('entries/:id')
  @Roles('admin', 'teacher', 'student', 'guardian')
  @ApiOperation({ summary: 'Get grade entry by ID' })
  @ApiParam({ name: 'id', description: 'Grade entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the grade entry.',
    type: GradeEntry,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade entry not found.' })
  findGradeEntryById(@Param('id') id: string): Promise<GradeEntry> {
    return this.gradesService.findGradeEntryById(id);
  }

  @Patch('entries/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update grade entry' })
  @ApiParam({ name: 'id', description: 'Grade entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade entry has been successfully updated.',
    type: GradeEntry,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade entry not found.' })
  updateGradeEntry(
    @Param('id') id: string,
    @Body() updateGradeEntryDto: UpdateGradeEntryDto,
  ): Promise<GradeEntry> {
    return this.gradesService.updateGradeEntry(id, updateGradeEntryDto);
  }

  @Delete('entries/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Delete grade entry' })
  @ApiParam({ name: 'id', description: 'Grade entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade entry has been successfully deleted.',
    type: GradeEntry,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade entry not found.' })
  removeGradeEntry(@Param('id') id: string): Promise<GradeEntry> {
    return this.gradesService.removeGradeEntry(id);
  }

  @Post('templates')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new grade template' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The grade template has been successfully created.',
    type: GradeTemplate,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createGradeTemplate(@Body() createGradeTemplateDto: CreateGradeTemplateDto): Promise<GradeTemplate> {
    return this.gradesService.createGradeTemplate(createGradeTemplateDto);
  }

  @Get('templates')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Get all grade templates' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all grade templates.',
    type: [GradeTemplate],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAllGradeTemplates(): Promise<GradeTemplate[]> {
    return this.gradesService.findAllGradeTemplates();
  }

  @Get('templates/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Get grade template by ID' })
  @ApiParam({ name: 'id', description: 'Grade template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the grade template.',
    type: GradeTemplate,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade template not found.' })
  findGradeTemplateById(@Param('id') id: string): Promise<GradeTemplate> {
    return this.gradesService.findGradeTemplateById(id);
  }

  @Patch('templates/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update grade template' })
  @ApiParam({ name: 'id', description: 'Grade template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade template has been successfully updated.',
    type: GradeTemplate,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade template not found.' })
  updateGradeTemplate(
    @Param('id') id: string,
    @Body() updateGradeTemplateDto: UpdateGradeTemplateDto,
  ): Promise<GradeTemplate> {
    return this.gradesService.updateGradeTemplate(id, updateGradeTemplateDto);
  }

  @Delete('templates/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete grade template' })
  @ApiParam({ name: 'id', description: 'Grade template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The grade template has been successfully deleted.',
    type: GradeTemplate,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grade template not found.' })
  removeGradeTemplate(@Param('id') id: string): Promise<GradeTemplate> {
    return this.gradesService.removeGradeTemplate(id);
  }

  @Get('statistics/student/:studentId/class/:classId')
  @Roles('admin', 'teacher', 'student', 'guardian')
  @ApiOperation({ summary: 'Get grade statistics for a student in a class' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns grade statistics for the student in the class.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student or class not found.' })
  calculateStudentGradeStatistics(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
  ): Promise<any> {
    return this.gradesService.calculateStudentGradeStatistics(studentId, classId);
  }
}

