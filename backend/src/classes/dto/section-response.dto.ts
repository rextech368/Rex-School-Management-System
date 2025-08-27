import { ApiProperty } from '@nestjs/swagger';
import { SectionStatus } from '../entities/section.entity';

export class SectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  capacity?: number;

  @ApiProperty()
  enrolledStudents: number;

  @ApiProperty({ enum: SectionStatus })
  status: SectionStatus;

  @ApiProperty({ required: false })
  roomNumber?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  classId: string;

  @ApiProperty({ required: false })
  class?: {
    id: string;
    name: string;
    grade: string;
  };

  @ApiProperty({ required: false })
  classSectionTeacherId?: string;

  @ApiProperty({ required: false })
  classSectionTeacher?: {
    id: string;
    fullName: string;
    email: string;
  };

  @ApiProperty({ required: false, type: [Object] })
  teachers?: {
    id: string;
    fullName: string;
    email: string;
  }[];

  @ApiProperty({ required: false, type: [Object] })
  students?: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  }[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

