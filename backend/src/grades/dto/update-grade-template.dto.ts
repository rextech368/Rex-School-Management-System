import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsUUID, 
  IsBoolean,
  IsObject
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GradeScale } from '../enums/grade-scale.enum';

export class UpdateGradeTemplateDto {
  @ApiProperty({ description: 'Name of the grade template', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description of the grade template', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Grade scale used for this template', enum: GradeScale, required: false })
  @IsOptional()
  @IsEnum(GradeScale)
  gradeScale?: GradeScale;

  @ApiProperty({ 
    description: 'JSON structure defining grade categories and weights',
    required: false,
    example: {
      'Assignments': 30,
      'Quizzes': 20,
      'Tests': 30,
      'Final Exam': 20
    }
  })
  @IsOptional()
  @IsObject()
  categories?: Record<string, any>;

  @ApiProperty({ 
    description: 'JSON structure defining grade thresholds for letter grades',
    required: false,
    example: {
      'A': 90,
      'B': 80,
      'C': 70,
      'D': 60,
      'F': 0
    }
  })
  @IsOptional()
  @IsObject()
  letterGradeThresholds?: Record<string, number>;

  @ApiProperty({ 
    description: 'JSON structure defining custom grade scales if applicable',
    required: false
  })
  @IsOptional()
  @IsObject()
  customScales?: Record<string, any>;

  @ApiProperty({ description: 'Whether this is a system default template', required: false })
  @IsOptional()
  @IsBoolean()
  isSystemDefault?: boolean;
}

