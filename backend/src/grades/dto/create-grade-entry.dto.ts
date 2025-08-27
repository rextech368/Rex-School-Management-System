import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsUUID, 
  IsBoolean,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeEntryDto {
  @ApiProperty({ description: 'Grade item ID' })
  @IsUUID()
  gradeItemId: string;

  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Score achieved by the student' })
  @IsNumber()
  @Min(0)
  score: number;

  @ApiProperty({ description: 'Letter grade (if applicable)', required: false })
  @IsOptional()
  @IsString()
  letterGrade?: string;

  @ApiProperty({ description: 'Feedback or comments on the grade', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ description: 'Whether the grade has been submitted' })
  @IsBoolean()
  isSubmitted: boolean;

  @ApiProperty({ description: 'Whether the student was exempt from this grade item', required: false })
  @IsOptional()
  @IsBoolean()
  isExempt?: boolean;

  @ApiProperty({ description: 'Reason for exemption', required: false })
  @IsOptional()
  @IsString()
  exemptReason?: string;
}

