import { ApiProperty } from '@nestjs/swagger';
import { ClassStatus } from '../entities/class.entity';

export class ClassResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  grade?: string;

  @ApiProperty({ required: false })
  level?: number;

  @ApiProperty({ required: false })
  capacity?: number;

  @ApiProperty()
  enrolledStudents: number;

  @ApiProperty({ enum: ClassStatus })
  status: ClassStatus;

  @ApiProperty({ required: false })
  roomNumber?: string;

  @ApiProperty({ required: false })
  building?: string;

  @ApiProperty({ required: false })
  floor?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  academicYearId?: string;

  @ApiProperty({ required: false })
  academicYear?: {
    id: string;
    name: string;
    isCurrent: boolean;
  };

  @ApiProperty({ required: false })
  headTeacherId?: string;

  @ApiProperty({ required: false })
  headTeacher?: {
    id: string;
    fullName: string;
    email: string;
  };

  @ApiProperty({ required: false, type: [Object] })
  sections?: {
    id: string;
    name: string;
    enrolledStudents: number;
    status: string;
  }[];

  @ApiProperty({ required: false, type: [Object] })
  teachers?: {
    id: string;
    fullName: string;
    email: string;
  }[];

  @ApiProperty({ required: false, type: [Object] })
  subjects?: {
    id: string;
    name: string;
    code: string;
  }[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

