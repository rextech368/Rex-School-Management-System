import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Gender, BloodGroup, StudentStatus } from '../entities/student.entity';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isTwoFactorEnabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class ClassResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: string;

  @ApiProperty({ required: false })
  description?: string;
}

class SectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
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

export class StudentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  admissionNumber: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  middleName?: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: BloodGroup, required: false })
  bloodGroup?: BloodGroup;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  postalCode?: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ required: false })
  religion?: string;

  @ApiProperty({ required: false })
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  emergencyContactRelationship?: string;

  @ApiProperty({ required: false })
  medicalConditions?: string;

  @ApiProperty({ required: false })
  allergies?: string;

  @ApiProperty({ required: false })
  medications?: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty()
  admissionDate: Date;

  @ApiProperty({ required: false })
  graduationDate?: Date;

  @ApiProperty({ enum: StudentStatus })
  status: StudentStatus;

  @ApiProperty({ required: false })
  previousSchool?: string;

  @ApiProperty({ required: false })
  previousSchoolAddress?: string;

  @ApiProperty({ required: false })
  transferCertificateNumber?: string;

  @ApiProperty({ required: false })
  birthCertificateNumber?: string;

  @ApiProperty({ required: false })
  idCardNumber?: string;

  @ApiProperty({ required: false })
  rollNumber?: string;

  @ApiProperty({ required: false })
  house?: string;

  @ApiProperty({ required: false })
  registrationNumber?: string;

  @ApiProperty({ type: [String], required: false })
  documents?: string[];

  @ApiProperty({ required: false })
  specialNeeds?: string;

  @ApiProperty({ required: false })
  scholarshipInfo?: string;

  @ApiProperty({ required: false })
  feeCategory?: string;

  @ApiProperty({ required: false })
  busRouteNumber?: string;

  @ApiProperty({ required: false })
  busStop?: string;

  @ApiProperty({ required: false })
  hostelRoomNumber?: string;

  @ApiProperty({ required: false })
  lockerNumber?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiProperty({ type: ClassResponseDto, required: false })
  @Type(() => ClassResponseDto)
  currentClass?: ClassResponseDto;

  @ApiProperty({ type: SectionResponseDto, required: false })
  @Type(() => SectionResponseDto)
  currentSection?: SectionResponseDto;

  @ApiProperty({ type: AcademicYearResponseDto, required: false })
  @Type(() => AcademicYearResponseDto)
  academicYear?: AcademicYearResponseDto;

  @Exclude()
  userId?: string;

  @Exclude()
  currentClassId?: string;

  @Exclude()
  currentSectionId?: string;

  @Exclude()
  academicYearId?: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;

  @Exclude()
  updatedBy?: string;

  @Exclude()
  deletedBy?: string;
}

