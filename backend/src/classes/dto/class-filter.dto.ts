import { 
  IsString, 
  IsUUID,
  IsEnum,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassType } from '../enums/class-type.enum';

export class ClassFilterDto {
  @ApiProperty({ description: 'Search term for name or code', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by course ID', required: false })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiProperty({ description: 'Filter by term ID', required: false })
  @IsOptional()
  @IsUUID()
  termId?: string;

  @ApiProperty({ description: 'Filter by class type', enum: ClassType, required: false })
  @IsOptional()
  @IsEnum(ClassType)
  type?: ClassType;

  @ApiProperty({ description: 'Filter by primary teacher ID', required: false })
  @IsOptional()
  @IsUUID()
  primaryTeacherId?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Filter by student ID (classes student is enrolled in)', required: false })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ description: 'Filter by assistant teacher ID', required: false })
  @IsOptional()
  @IsUUID()
  assistantTeacherId?: string;
}

