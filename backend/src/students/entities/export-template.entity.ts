import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { ExportFormat } from '../enums/export-format.enum';

@Entity('export_templates')
export class ExportTemplate extends BaseEntity {
  @ApiProperty({ description: 'Template name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Template description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Export format', enum: ExportFormat })
  @Column({
    type: 'enum',
    enum: ExportFormat,
    default: ExportFormat.CSV,
  })
  format: ExportFormat;

  @ApiProperty({ description: 'Fields to include in the export' })
  @Column({ type: 'jsonb' })
  fields: string[];

  @ApiProperty({ description: 'Header text for PDF exports', required: false })
  @Column({ type: 'text', nullable: true })
  headerText?: string;

  @ApiProperty({ description: 'Footer text for PDF exports', required: false })
  @Column({ type: 'text', nullable: true })
  footerText?: string;

  @ApiProperty({ description: 'Include header row', required: false })
  @Column({ default: true })
  includeHeader: boolean;

  @ApiProperty({ description: 'Default filters to apply', required: false })
  @Column({ type: 'jsonb', nullable: true })
  defaultFilters?: Record<string, any>;

  @ApiProperty({ description: 'Is template active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;
}

