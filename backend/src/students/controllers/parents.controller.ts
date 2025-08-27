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
import { ParentsService } from '../services/parents.service';
import { CreateParentDto } from '../dto/parent/create-parent.dto';
import { UpdateParentDto } from '../dto/parent/update-parent.dto';
import { ParentResponseDto } from '../dto/parent/parent-response.dto';
import { ParentFilterDto } from '../dto/parent/parent-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('parents')
@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Create a new parent' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The parent has been successfully created.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createParentDto: CreateParentDto, @Request() req): Promise<ParentResponseDto> {
    const parent = await this.parentsService.create(createParentDto, req.user.id);
    return this.mapToResponseDto(parent);
  }

  @Get()
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get all parents with filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all parents.',
    type: [ParentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(@Query() filterDto: ParentFilterDto): Promise<{ data: ParentResponseDto[]; total: number }> {
    const [parents, total] = await this.parentsService.findAll(filterDto);
    return {
      data: parents.map(parent => this.mapToResponseDto(parent)),
      total,
    };
  }

  @Get(':id')
  @Roles('admin', 'registrar', 'teacher', 'parent')
  @ApiOperation({ summary: 'Get a parent by id' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the parent.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<ParentResponseDto> {
    const parent = await this.parentsService.findOne(id);
    return this.mapToResponseDto(parent);
  }

  @Get('email/:email')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get a parent by email' })
  @ApiParam({ name: 'email', description: 'Parent email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the parent.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findByEmail(@Param('email') email: string): Promise<ParentResponseDto> {
    const parent = await this.parentsService.findByEmail(email);
    return this.mapToResponseDto(parent);
  }

  @Patch(':id')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Update a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The parent has been successfully updated.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @Request() req,
  ): Promise<ParentResponseDto> {
    const parent = await this.parentsService.update(id, updateParentDto, req.user.id);
    return this.mapToResponseDto(parent);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The parent has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.parentsService.remove(id, req.user.id);
  }

  @Post(':id/restore')
  @Roles('admin')
  @ApiOperation({ summary: 'Restore a deleted parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The parent has been successfully restored.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Parent is not deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async restore(@Param('id') id: string): Promise<ParentResponseDto> {
    const parent = await this.parentsService.restore(id);
    return this.mapToResponseDto(parent);
  }

  @Post('bulk-delete')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete multiple parents' })
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
          description: 'Array of parent IDs to delete',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The parents have been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkDelete(@Body('ids') ids: string[], @Request() req): Promise<void> {
    await this.parentsService.bulkDelete(ids, req.user.id);
  }

  @Get('student/:studentId')
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get parents by student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return parents of the student.',
    type: [ParentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getParentsByStudent(@Param('studentId') studentId: string): Promise<ParentResponseDto[]> {
    const parents = await this.parentsService.getParentsByStudent(studentId);
    return parents.map(parent => this.mapToResponseDto(parent));
  }

  @Post(':id/add-student/:studentId')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Add a student to a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully added to the parent.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent or student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async addStudentToParent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<ParentResponseDto> {
    const parent = await this.parentsService.addStudentToParent(id, studentId);
    return this.mapToResponseDto(parent);
  }

  @Delete(':id/remove-student/:studentId')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Remove a student from a parent' })
  @ApiParam({ name: 'id', description: 'Parent ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The student has been successfully removed from the parent.',
    type: ParentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async removeStudentFromParent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<ParentResponseDto> {
    const parent = await this.parentsService.removeStudentFromParent(id, studentId);
    return this.mapToResponseDto(parent);
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(parent: any): ParentResponseDto {
    const responseDto = new ParentResponseDto();
    Object.assign(responseDto, parent);
    return responseDto;
  }
}

