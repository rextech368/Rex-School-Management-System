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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StudentDocumentsService } from '../services/student-documents.service';
import { CreateStudentDocumentDto } from '../dto/document/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/document/update-student-document.dto';
import { StudentDocumentResponseDto } from '../dto/document/student-document-response.dto';
import { StudentDocumentFilterDto } from '../dto/document/student-document-filter.dto';
import { UploadDocumentDto } from '../dto/document/upload-document.dto';
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

  @Post('upload')
  @Roles('admin', 'registrar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document file and create a document record' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to upload',
        },
        title: {
          type: 'string',
          description: 'Document title',
        },
        type: {
          type: 'string',
          enum: [
            'birth_certificate',
            'transfer_certificate',
            'medical_record',
            'report_card',
            'id_card',
            'passport',
            'visa',
            'residence_permit',
            'vaccination_record',
            'scholarship_document',
            'special_needs_document',
            'parent_id',
            'guardian_authorization',
            'financial_document',
            'other',
          ],
          description: 'Document type',
        },
        description: {
          type: 'string',
          description: 'Document description',
        },
        issueDate: {
          type: 'string',
          format: 'date',
          description: 'Document issue date',
        },
        expiryDate: {
          type: 'string',
          format: 'date',
          description: 'Document expiry date',
        },
        referenceNumber: {
          type: 'string',
          description: 'Document reference number',
        },
        issuingAuthority: {
          type: 'string',
          description: 'Document issuing authority',
        },
        studentId: {
          type: 'string',
          format: 'uuid',
          description: 'Student ID',
        },
      },
      required: ['file', 'title', 'type', 'studentId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The document has been successfully uploaded and created.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(pdf|jpeg|jpg|png|gif|doc|docx|xls|xlsx)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Request() req,
  ): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.uploadDocument(
      file,
      uploadDocumentDto,
      req.user.id,
    );
    return this.mapToResponseDto(document);
  }

  @Post('upload-multiple')
  @Roles('admin', 'registrar')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple document files and create document records' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Document files to upload',
        },
        documents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              type: { type: 'string' },
              description: { type: 'string' },
              issueDate: { type: 'string', format: 'date' },
              expiryDate: { type: 'string', format: 'date' },
              referenceNumber: { type: 'string' },
              issuingAuthority: { type: 'string' },
              studentId: { type: 'string', format: 'uuid' },
            },
          },
          description: 'Document metadata for each file',
        },
      },
      required: ['files', 'documents'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The documents have been successfully uploaded and created.',
    type: [StudentDocumentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async uploadMultipleDocuments(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('documents') documentsJson: string,
    @Request() req,
  ): Promise<StudentDocumentResponseDto[]> {
    // Parse the JSON string to get the document metadata
    const documents: UploadDocumentDto[] = JSON.parse(documentsJson);

    if (files.length !== documents.length) {
      throw new Error('Number of files and document metadata must match');
    }

    const uploadedDocuments = await this.documentsService.uploadMultipleDocuments(
      files,
      documents,
      req.user.id,
    );
    return uploadedDocuments.map(document => this.mapToResponseDto(document));
  }

  @Post(':id/replace-file')
  @Roles('admin', 'registrar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Replace a document file' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New document file',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document file has been successfully replaced.',
    type: StudentDocumentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async replaceDocumentFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(pdf|jpeg|jpg|png|gif|doc|docx|xls|xlsx)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<StudentDocumentResponseDto> {
    const document = await this.documentsService.replaceDocumentFile(
      id,
      file,
      req.user.id,
    );
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

