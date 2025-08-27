import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StudentStatus } from '../entities/student.entity';

export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['admissionNumber'] as const),
) {
  @ApiProperty({ 
    description: 'Student status', 
    enum: StudentStatus, 
    required: false,
    example: StudentStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}

