import { 
  IsString, 
  IsDateString, 
  IsOptional, 
  IsUUID, 
  IsEmail, 
  IsEnum, 
  IsArray, 
  ValidateNested,
  IsBoolean,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, BloodGroup, StudentStatus } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student admission number', example: 'ADM-2023-001' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  admissionNumber: string;

  @ApiProperty({ description: 'Student first name', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Student last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Student middle name', required: false, example: 'Robert' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  middleName?: string;

  @ApiProperty({ description: 'Student date of birth', example: '2010-05-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ description: 'Student gender', enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Student blood group', enum: BloodGroup, required: false, example: BloodGroup.O_POSITIVE })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiProperty({ description: 'Student address', required: false, example: '123 School Lane' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Student city', required: false, example: 'Douala' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Student state/province', required: false, example: 'Littoral' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Student country', required: false, example: 'Cameroon' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Student postal code', required: false, example: '00237' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Student phone number', required: false, example: '+237612345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Student email address', required: false, example: 'student@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Student nationality', required: false, example: 'Cameroonian' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Student religion', required: false, example: 'Christianity' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiProperty({ description: 'Student emergency contact name', required: false, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiProperty({ description: 'Student emergency contact phone', required: false, example: '+237612345679' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Student emergency contact relationship', required: false, example: 'Mother' })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @ApiProperty({ description: 'Student medical conditions', required: false, example: 'Asthma' })
  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @ApiProperty({ description: 'Student allergies', required: false, example: 'Peanuts' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ description: 'Student medications', required: false, example: 'Inhaler as needed' })
  @IsOptional()
  @IsString()
  medications?: string;

  @ApiProperty({ description: 'Student profile picture URL', required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: 'Student admission date', example: '2023-09-01' })
  @IsDateString()
  admissionDate: string;

  @ApiProperty({ description: 'Student graduation date', required: false, example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  graduationDate?: string;

  @ApiProperty({ description: 'Student status', enum: StudentStatus, default: StudentStatus.ACTIVE, example: StudentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ description: 'Previous school name', required: false, example: 'Previous Academy' })
  @IsOptional()
  @IsString()
  previousSchool?: string;

  @ApiProperty({ description: 'Previous school address', required: false, example: '456 Old School Road, Yaounde' })
  @IsOptional()
  @IsString()
  previousSchoolAddress?: string;

  @ApiProperty({ description: 'Transfer certificate number', required: false, example: 'TC-12345' })
  @IsOptional()
  @IsString()
  transferCertificateNumber?: string;

  @ApiProperty({ description: 'Birth certificate number', required: false, example: 'BC-67890' })
  @IsOptional()
  @IsString()
  birthCertificateNumber?: string;

  @ApiProperty({ description: 'Student ID card number', required: false, example: 'ID-54321' })
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @ApiProperty({ description: 'User ID for student account', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Current class ID', required: false })
  @IsOptional()
  @IsUUID()
  currentClassId?: string;

  @ApiProperty({ description: 'Current section ID', required: false })
  @IsOptional()
  @IsUUID()
  currentSectionId?: string;

  @ApiProperty({ description: 'Current academic year ID', required: false })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiProperty({ description: 'Roll number in current class', required: false, example: '23' })
  @IsOptional()
  @IsString()
  rollNumber?: string;

  @ApiProperty({ description: 'House/Team assignment', required: false, example: 'Red House' })
  @IsOptional()
  @IsString()
  house?: string;

  @ApiProperty({ description: 'Student registration number', required: false, example: 'REG-2023-001' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ description: 'Student documents', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @ApiProperty({ description: 'Special needs or accommodations', required: false, example: 'Requires extra time for exams' })
  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @ApiProperty({ description: 'Scholarship information', required: false, example: 'Full academic scholarship' })
  @IsOptional()
  @IsString()
  scholarshipInfo?: string;

  @ApiProperty({ description: 'Fee category', required: false, example: 'Standard' })
  @IsOptional()
  @IsString()
  feeCategory?: string;

  @ApiProperty({ description: 'Bus route number', required: false, example: 'Route 3' })
  @IsOptional()
  @IsString()
  busRouteNumber?: string;

  @ApiProperty({ description: 'Bus stop', required: false, example: 'Central Market' })
  @IsOptional()
  @IsString()
  busStop?: string;

  @ApiProperty({ description: 'Hostel room number', required: false, example: 'B-204' })
  @IsOptional()
  @IsString()
  hostelRoomNumber?: string;

  @ApiProperty({ description: 'Locker number', required: false, example: 'L-123' })
  @IsOptional()
  @IsString()
  lockerNumber?: string;

  @ApiProperty({ description: 'Create user account for student', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  createUserAccount?: boolean;

  @ApiProperty({ description: 'Parent IDs to associate with student', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  parentIds?: string[];
}

