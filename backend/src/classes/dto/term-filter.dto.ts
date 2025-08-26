import { 
  IsString, 
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TermType } from '../enums/term-type.enum';

export class TermFilterDto {
  @ApiProperty({ description: 'Search term for name', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by academic year', required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ description: 'Filter by term type', enum: TermType, required: false })
  @IsOptional()
  @IsEnum(TermType)
  type?: TermType;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Filter by current status', required: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ description: 'Filter by start date (after)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDateAfter?: Date;

  @ApiProperty({ description: 'Filter by end date (before)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDateBefore?: Date;
}

