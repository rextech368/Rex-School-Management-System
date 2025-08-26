import { PartialType } from '@nestjs/swagger';
import { CreateStudentGroupDto } from './create-student-group.dto';
import { IsOptional, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentGroupDto extends PartialType(CreateStudentGroupDto) {
  @ApiProperty({ description: 'Student IDs to add to group', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  addStudentIds?: string[];

  @ApiProperty({ description: 'Student IDs to remove from group', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  removeStudentIds?: string[];

  @ApiProperty({ description: 'Replace all students with these IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  replaceStudentIds?: string[];

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

