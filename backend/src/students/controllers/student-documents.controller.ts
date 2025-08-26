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
import { StudentDocumentsService } from '../services/student-documents.service';
import { CreateStudentDocumentDto } from '../dto/document/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/document/update-student-document.dto';
import { StudentDocumentResponseDto } from '../dto/document/student-document-response.dto';
import { StudentDocumentFilterDto } from '../dto/document/student-document-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('student-documents')
@Controller('student-documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentDocumentsController {
  constructor(private readonly documentsService: StudentDocumentsService) {}

  @Post()
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Create a new student document' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The document has been successfully created.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createDocumentDto: CreateStudentDocumentDto, @Request() req): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.create(createDocumentDto, req.user.id);
    return this.mapToResponseDto(document);
  }

  @Get()
  @Roles('admin', 'registrar', 'teacher')
  @ApiOperation({ summary: 'Get all student documents with filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all student documents.',
    type: [StudentDocumentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(@Query() filterDto: StudentDocumentFilterDto): Promise<{ data: StudentDocumentResponseDto[]; total: number }> {
    const [documents, total] = await this.documentsService.findAll(filterDto);
    return {
      data: documents.map(document => this.mapToResponseDto(document)),
      total,
    };
  }

  @Get(':id')
  @Roles('admin', 'registrar', 'teacher', 'parent', 'student')
  @ApiOperation({ summary: 'Get a student document by id' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the document.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.findOne(id);
    return this.mapToResponseDto(document);
  }

  @Get('student/:studentId')
  @Roles('admin', 'registrar', 'teacher', 'parent', 'student')
  @ApiOperation({ summary: 'Get documents by student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return documents of the student.',
    type: [StudentDocumentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findByStudent(@Param('studentId') studentId: string): Promise<StudentDocumentResponseDto[]> {
    const documents = await this.documentsService.findByStudent(studentId);
    return documents.map(document => this.mapToResponseDto(document));
  }

  @Patch(':id')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Update a student document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document has been successfully updated.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateStudentDocumentDto,
    @Request() req,
  ): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.update(id, updateDocumentDto, req.user.id);
    return this.mapToResponseDto(document);
  }

  @Delete(':id')
  @Roles('admin', 'registrar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The document has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.documentsService.remove(id, req.user.id);
  }

  @Post(':id/verify')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Verify a student document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        verificationNotes: {
          type: 'string',
          description: 'Notes about the verification',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document has been successfully verified.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async verifyDocument(
    @Param('id') id: string,
    @Body('verificationNotes') verificationNotes: string,
    @Request() req,
  ): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.verifyDocument(id, req.user.id, verificationNotes);
    return this.mapToResponseDto(document);
  }

  @Post('bulk-verify')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Verify multiple student documents' })
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
          description: 'Array of document IDs to verify',
        },
        verificationNotes: {
          type: 'string',
          description: 'Notes about the verification',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'The documents have been successfully verified.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkVerify(
    @Body('ids') ids: string[],
    @Body('verificationNotes') verificationNotes: string,
    @Request() req,
  ): Promise<{ success: boolean }> {
    await this.documentsService.bulkVerify(ids, req.user.id, verificationNotes);
    return { success: true };
  }

  @Post('bulk-delete')
  @Roles('admin', 'registrar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete multiple student documents' })
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
          description: 'Array of document IDs to delete',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The documents have been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkDelete(@Body('ids') ids: string[], @Request() req): Promise<void> {
    await this.documentsService.bulkDelete(ids, req.user.id);
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(document: any): StudentDocumentResponseDto {
    const responseDto = new StudentDocumentResponseDto();
    Object.assign(responseDto, document);
    return responseDto;
  }
}

