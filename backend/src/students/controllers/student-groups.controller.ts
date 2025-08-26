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
} from '@nestjs/swagger';
import { StudentGroupsService } from '../services/student-groups.service';
import { CreateStudentGroupDto } from '../dto/group/create-student-group.dto';
import { UpdateStudentGroupDto } from '../dto/group/update-student-group.dto';
import { StudentGroupResponseDto } from '../dto/group/student-group-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('student-groups')
@Controller('student-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentGroupsController {
  constructor(private readonly groupsService: StudentGroupsService) {}

  @Post()
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Create a new student group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The group has been successfully created.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createGroupDto: CreateStudentGroupDto, @Request() req): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.create(createGroupDto, req.user.id);
    return this.mapToResponseDto(group);
  }

  @Get()
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get all student groups with filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all student groups.',
    type: [StudentGroupResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(@Query() filters: any): Promise<{ data: StudentGroupResponseDto[]; total: number }> {
    const [groups, total] = await this.groupsService.findAll(filters);
    return {
      data: groups.map(group => this.mapToResponseDto(group)),
      total,
    };
  }

  @Get(':id')
  @Roles('admin', 'registrar', 'teacher', 'parent', 'student')
  @ApiOperation({ summary: 'Get a student group by id' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the group.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.findOne(id);
    return this.mapToResponseDto(group);
  }

  @Patch(':id')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Update a student group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The group has been successfully updated.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateStudentGroupDto,
    @Request() req,
  ): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.update(id, updateGroupDto, req.user.id);
    return this.mapToResponseDto(group);
  }

  @Delete(':id')
  @Roles('admin', 'registrar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The group has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.groupsService.remove(id, req.user.id);
  }

  @Post(':id/restore')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Restore a deleted student group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The group has been successfully restored.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Group is not deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async restore(@Param('id') id: string): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.restore(id);
    return this.mapToResponseDto(group);
  }

  @Get('student/:studentId')
  @Roles('admin', 'registrar', 'teacher', 'parent', 'student')
  @ApiOperation({ summary: 'Get groups by student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return groups of the student.',
    type: [StudentGroupResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getGroupsByStudent(@Param('studentId') studentId: string): Promise<StudentGroupResponseDto[]> {
    const groups = await this.groupsService.getGroupsByStudent(studentId);
    return groups.map(group => this.mapToResponseDto(group));
  }

  @Post(':id/add-student/:studentId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Add a student to a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully added to the group.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group or student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async addStudentToGroup(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.addStudentToGroup(id, studentId);
    return this.mapToResponseDto(group);
  }

  @Delete(':id/remove-student/:studentId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Remove a student from a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully removed from the group.',
    type: StudentGroupResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Group not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async removeStudentFromGroup(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<StudentGroupResponseDto> {
    const group = await this.groupsService.removeStudentFromGroup(id, studentId);
    return this.mapToResponseDto(group);
  }

  @Post('bulk-delete')
  @Roles('admin', 'registrar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete multiple student groups' })
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
          description: 'Array of group IDs to delete',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The groups have been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkDelete(@Body('ids') ids: string[], @Request() req): Promise<void> {
    await this.groupsService.bulkDelete(ids, req.user.id);
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(group: any): StudentGroupResponseDto {
    const responseDto = new StudentGroupResponseDto();
    Object.assign(responseDto, group);
    
    // Add student count if not present
    if (group.students && !responseDto.studentCount) {
      responseDto.studentCount = group.students.length;
    }
    
    return responseDto;
  }
}

