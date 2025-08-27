import { IsArray, IsDate, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAttendanceDto } from './create-attendance.dto';

export class BulkCreateAttendanceDto {
  @ApiProperty({ description: 'Date of attendance records' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Class or session ID', required: false })
  @IsUUID()
  classId: string;

  @ApiProperty({ description: 'Recorded by user ID' })
  @IsUUID()
  recordedBy: string;

  @ApiProperty({ description: 'List of attendance records', type: [CreateAttendanceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records: CreateAttendanceDto[];
}

