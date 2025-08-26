import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceType } from '../entities/attendance-record.entity';
import { CreateAttendanceRecordDto } from './create-attendance-record.dto';

export class BulkAttendanceRecordsDto {
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [CreateAttendanceRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceRecordDto)
  records: CreateAttendanceRecordDto[];
}

