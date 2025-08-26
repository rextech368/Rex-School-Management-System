import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus, AttendanceType } from '../entities/attendance-record.entity';

export class AttendanceRecordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty({ required: false })
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  };

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

  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;

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

  @ApiProperty({ required: false })
  timeIn?: Date;

  @ApiProperty({ required: false })
  timeOut?: Date;

  @ApiProperty({ required: false })
  remarks?: string;

  @ApiProperty()
  notified: boolean;

  @ApiProperty({ required: false })
  notifiedAt?: Date;

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

