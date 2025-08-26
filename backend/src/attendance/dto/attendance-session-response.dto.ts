import { ApiProperty } from '@nestjs/swagger';
import { AttendanceType } from '../entities/attendance-record.entity';
import { AttendanceSessionStatus } from '../entities/attendance-session.entity';
import { AttendanceRecordResponseDto } from './attendance-record-response.dto';

export class AttendanceSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  classId?: string;

  @ApiProperty({ required: false })
  class?: {
    id: string;
    name: string;
    grade?: string;
  };

  @ApiProperty({ required: false })
  sectionId?: string;

  @ApiProperty({ required: false })
  section?: {
    id: string;
    name: string;
  };

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: AttendanceType })
  type: AttendanceType;

  @ApiProperty({ required: false })
  subjectId?: string;

  @ApiProperty({ required: false })
  subject?: {
    id: string;
    name: string;
    code: string;
  };

  @ApiProperty({ required: false })
  eventId?: string;

  @ApiProperty({ required: false })
  event?: {
    id: string;
    name: string;
  };

  @ApiProperty({ enum: AttendanceSessionStatus })
  status: AttendanceSessionStatus;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  presentCount: number;

  @ApiProperty()
  absentCount: number;

  @ApiProperty()
  lateCount: number;

  @ApiProperty()
  excusedCount: number;

  @ApiProperty()
  halfDayCount: number;

  @ApiProperty({ type: [AttendanceRecordResponseDto], required: false })
  attendanceRecords?: AttendanceRecordResponseDto[];

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  creator?: {
    id: string;
    fullName: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

