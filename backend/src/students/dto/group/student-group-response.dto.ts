import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { GroupType } from '../../entities/student-group.entity';
import { StudentResponseDto } from '../student-response.dto';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: string;
}

class AcademicYearResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  isCurrent: boolean;
}

export class StudentGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: GroupType })
  type: GroupType;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  maxCapacity?: number;

  @ApiProperty({ required: false })
  colorCode?: string;

  @ApiProperty({ required: false })
  icon?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  meetingSchedule?: string;

  @ApiProperty({ required: false })
  meetingLocation?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: AcademicYearResponseDto, required: false })
  @Type(() => AcademicYearResponseDto)
  academicYear?: AcademicYearResponseDto;

  @ApiProperty({ type: StudentGroupResponseDto, required: false })
  @Type(() => StudentGroupResponseDto)
  parentGroup?: StudentGroupResponseDto;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Type(() => UserResponseDto)
  leader?: UserResponseDto;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Type(() => UserResponseDto)
  assistantLeader?: UserResponseDto;

  @ApiProperty({ type: [StudentResponseDto], required: false })
  @Type(() => StudentResponseDto)
  students?: StudentResponseDto[];

  @ApiProperty()
  studentCount: number;

  @Exclude()
  academicYearId?: string;

  @Exclude()
  parentGroupId?: string;

  @Exclude()
  leaderId?: string;

  @Exclude()
  assistantLeaderId?: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;

  @Exclude()
  updatedBy?: string;

  @Exclude()
  deletedBy?: string;
}

