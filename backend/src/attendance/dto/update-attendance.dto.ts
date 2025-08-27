import { IsEnum, IsOptional, IsString, IsBoolean, IsTime } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class UpdateAttendanceDto {
  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus, required: false })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

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

  @ApiProperty({ description: 'Whether notification was sent', required: false })
  @IsOptional()
  @IsBoolean()
  notificationSent?: boolean;
}

