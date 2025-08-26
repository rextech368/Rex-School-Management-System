import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceType } from '../entities/attendance-record.entity';
import { AttendanceSessionStatus } from '../entities/attendance-session.entity';
import { CreateAttendanceRecordDto } from './create-attendance-record.dto';

export class CreateAttendanceSessionDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  classId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ enum: AttendanceType, default: AttendanceType.DAILY })
  @IsEnum(AttendanceType)
  @IsOptional()
  type?: AttendanceType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  subjectId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiProperty({ enum: AttendanceSessionStatus, default: AttendanceSessionStatus.DRAFT })
  @IsEnum(AttendanceSessionStatus)
  @IsOptional()
  status?: AttendanceSessionStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [CreateAttendanceRecordDto], required: false })
  @IsArray()
  @IsOptional()
  @Type(() => CreateAttendanceRecordDto)
  attendanceRecords?: CreateAttendanceRecordDto[];
}

