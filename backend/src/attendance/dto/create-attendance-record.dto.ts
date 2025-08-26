import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsTime,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, AttendanceType } from '../entities/attendance-record.entity';

export class CreateAttendanceRecordDto {
  @ApiProperty()
  @IsUUID()
  studentId: string;

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

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

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

  @ApiProperty({ required: false })
  @IsTime()
  @IsOptional()
  @Type(() => Date)
  timeIn?: Date;

  @ApiProperty({ required: false })
  @IsTime()
  @IsOptional()
  @Type(() => Date)
  timeOut?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  notified?: boolean;
}

