import { 
  IsString, 
  IsOptional,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseFilterDto {
  @ApiProperty({ description: 'Search term for code, name, or description', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by department', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Filter by minimum grade level', required: false })
  @IsOptional()
  @IsString()
  minGradeLevel?: string;

  @ApiProperty({ description: 'Filter by maximum grade level', required: false })
  @IsOptional()
  @IsString()
  maxGradeLevel?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

