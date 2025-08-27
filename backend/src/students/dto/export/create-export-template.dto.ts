import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExportFormat } from '../../enums/export-format.enum';

export class CreateExportTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Export format', enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ description: 'Fields to include in the export' })
  @IsArray()
  fields: string[];

  @ApiProperty({ description: 'Header text for PDF exports', required: false })
  @IsOptional()
  @IsString()
  headerText?: string;

  @ApiProperty({ description: 'Footer text for PDF exports', required: false })
  @IsOptional()
  @IsString()
  footerText?: string;

  @ApiProperty({ description: 'Include header row', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  includeHeader?: boolean;

  @ApiProperty({ description: 'Default filters to apply', required: false })
  @IsOptional()
  @IsObject()
  defaultFilters?: Record<string, any>;

  @ApiProperty({ description: 'Is template active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}

