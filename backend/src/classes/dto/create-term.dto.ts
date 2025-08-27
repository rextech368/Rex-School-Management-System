import { 
  IsString, 
  IsEnum,
  IsDate,
  IsOptional,
  IsBoolean,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TermType } from '../enums/term-type.enum';

export class CreateTermDto {
  @ApiProperty({ description: 'Term name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Academic year (e.g., 2024-2025)' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({ description: 'Term type', enum: TermType })
  @IsEnum(TermType)
  type: TermType;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

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

