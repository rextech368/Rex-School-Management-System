import { 
  IsOptional, 
  IsUUID, 
  IsEnum, 
  IsDate, 
  IsString 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GradeType } from '../enums/grade-type.enum';

export class GradeFilterDto {
  @ApiProperty({ description: 'Student ID', required: false })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ description: 'Class or course ID', required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ description: 'Subject or course ID', required: false })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({ description: 'Grade item ID', required: false })
  @IsOptional()
  @IsUUID()
  gradeItemId?: string;

  @ApiProperty({ description: 'Type of grade item', enum: GradeType, required: false })
  @IsOptional()
  @IsEnum(GradeType)
  type?: GradeType;

  @ApiProperty({ description: 'Start date for assigned date range', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: 'End date for assigned date range', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Whether to include only published grades', required: false })
  @IsOptional()
  @IsString()
  published?: string;

  @ApiProperty({ description: 'Student name for search', required: false })
  @IsOptional()
  @IsString()
  studentName?: string;
}

