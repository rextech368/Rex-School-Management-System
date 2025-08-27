import { IsEnum, IsOptional, IsBoolean, IsArray, IsObject, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExportFormat } from '../../enums/export-format.enum';

export class ExportStudentsDto {
  @ApiProperty({ description: 'Export format', enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ description: 'Export template ID', required: false })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiProperty({ description: 'Filters to apply', required: false })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Fields to include in the export', required: false })
  @IsOptional()
  @IsArray()
  fields?: string[];

  @ApiProperty({ description: 'Include header row', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  includeHeader?: boolean;

  @ApiProperty({ description: 'Custom file name', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;
}

