import { 
  IsString, 
  IsEnum,
  IsDate,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TermType } from '../enums/term-type.enum';

export class UpdateTermDto {
  @ApiProperty({ description: 'Term name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Academic year (e.g., 2024-2025)', required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ description: 'Term type', enum: TermType, required: false })
  @IsOptional()
  @IsEnum(TermType)
  type?: TermType;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Whether the term is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Whether the term is current', required: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

