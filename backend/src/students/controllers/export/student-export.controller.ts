import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  HttpStatus,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { StudentExportService } from '../../services/export/student-export.service';
import { ExportStudentsDto } from '../../dto/export/export-students.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

@ApiTags('student-export')
@Controller('students/export')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentExportController {
  constructor(private readonly exportService: StudentExportService) {}

  @Post()
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Export students based on criteria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the exported file as a download.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No students found matching the criteria.' })
  async exportStudents(
    @Body() exportStudentsDto: ExportStudentsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const filePath = await this.exportService.exportStudents(exportStudentsDto);
      
      const fileName = filePath.split('/').pop();
      const fileStream = createReadStream(join(process.cwd(), filePath));
      
      let contentType: string;
      switch (exportStudentsDto.format) {
        case 'csv':
          contentType = 'text/csv';
          break;
        case 'excel':
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        default:
          contentType = 'application/octet-stream';
      }
      
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      
      return new StreamableFile(fileStream);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to generate export file');
    }
  }

  @Get('available-fields')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Get available fields for student export' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the list of available fields for export.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getAvailableFields(): Promise<string[]> {
    // This would typically come from a service that analyzes the Student entity
    return [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'enrollmentDate',
      'status',
      'program.id',
      'program.name',
      'program.description',
      'guardians.name',
      'guardians.relationship',
      'guardians.phoneNumber',
      'guardians.email',
    ];
  }
}

