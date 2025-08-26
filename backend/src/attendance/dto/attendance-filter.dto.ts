import { IsOptional, IsUUID, IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class AttendanceFilterDto {
  @ApiProperty({ description: 'Student ID', required: false })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus, required: false })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiProperty({ description: 'Class or session ID', required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ description: 'Student name for search', required: false })
  @IsOptional()
  @IsString()
  studentName?: string;
}

