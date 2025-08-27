import { IsUUID, IsDate, IsEnum, IsOptional, IsString, IsBoolean, IsTime } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class CreateAttendanceDto {
  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Date of attendance record' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Time in (for partial attendance)', required: false })
  @IsOptional()
  @IsTime()
  timeIn?: string;

  @ApiProperty({ description: 'Time out (for partial attendance)', required: false })
  @IsOptional()
  @IsTime()
  timeOut?: string;

  @ApiProperty({ description: 'Notes about the attendance', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Reason for absence/late arrival', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Whether the absence is excused', required: false })
  @IsOptional()
  @IsBoolean()
  isExcused?: boolean;

  @ApiProperty({ description: 'Class or session ID', required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ description: 'Recorded by user ID' })
  @IsUUID()
  recordedBy: string;
}

