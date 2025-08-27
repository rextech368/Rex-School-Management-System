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

export class UpdateGradeEntryDto {
  @ApiProperty({ description: 'Score achieved by the student', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiProperty({ description: 'Letter grade (if applicable)', required: false })
  @IsOptional()
  @IsString()
  letterGrade?: string;

  @ApiProperty({ description: 'Feedback or comments on the grade', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ description: 'Whether the grade has been submitted', required: false })
  @IsOptional()
  @IsBoolean()
  isSubmitted?: boolean;

  @ApiProperty({ description: 'Whether the student was exempt from this grade item', required: false })
  @IsOptional()
  @IsBoolean()
  isExempt?: boolean;

  @ApiProperty({ description: 'Reason for exemption', required: false })
  @IsOptional()
  @IsString()
  exemptReason?: string;

  @ApiProperty({ description: 'User ID of who last modified the grade', required: false })
  @IsOptional()
  @IsUUID()
  modifiedBy?: string;

  @ApiProperty({ description: 'Whether notification was sent to student/guardian', required: false })
  @IsOptional()
  @IsBoolean()
  notificationSent?: boolean;
}

