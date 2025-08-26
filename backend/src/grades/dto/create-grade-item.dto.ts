import { 
  IsString, 
  IsEnum, 
  IsDate, 
  IsOptional, 
  IsNumber, 
  IsUUID, 
  IsBoolean,
  Min,
  Max,
  IsPositive
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GradeType } from '../enums/grade-type.enum';
import { GradeScale } from '../enums/grade-scale.enum';

export class CreateGradeItemDto {
  @ApiProperty({ description: 'Title of the grade item' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the grade item', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Type of grade item', enum: GradeType })
  @IsEnum(GradeType)
  type: GradeType;

  @ApiProperty({ description: 'Date the grade item was assigned' })
  @IsDate()
  @Type(() => Date)
  assignedDate: Date;

  @ApiProperty({ description: 'Due date for the grade item', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({ description: 'Maximum possible score' })
  @IsNumber()
  @IsPositive()
  maxScore: number;

  @ApiProperty({ description: 'Weight of this grade item in the overall grade calculation' })
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(100)
  weight: number;

  @ApiProperty({ description: 'Grade scale used for this item', enum: GradeScale })
  @IsEnum(GradeScale)
  gradeScale: GradeScale;

  @ApiProperty({ description: 'Whether the grade item is published to students/guardians' })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ description: 'Class or course ID' })
  @IsUUID()
  classId: string;

  @ApiProperty({ description: 'Subject or course ID', required: false })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({ description: 'Teacher or creator ID' })
  @IsUUID()
  createdBy: string;
}

