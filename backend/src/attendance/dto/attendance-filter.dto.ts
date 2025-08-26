import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsDate,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, AttendanceType } from '../entities/attendance-record.entity';
import { AttendanceSessionStatus } from '../entities/attendance-session.entity';

export class AttendanceFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false, enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiProperty({ required: false, enum: AttendanceType })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiProperty({ required: false, enum: AttendanceSessionStatus })
  @IsOptional()
  @IsEnum(AttendanceSessionStatus)
  sessionStatus?: AttendanceSessionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false, default: 'date' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

