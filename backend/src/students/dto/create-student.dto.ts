import { 
  IsString, 
  IsEnum, 
  IsDate, 
  IsOptional, 
  IsEmail, 
  IsPhoneNumber,
  IsUUID,
  IsUrl,
  IsArray,
  ValidateNested,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enums/gender.enum';
import { StudentStatus } from '../enums/student-status.enum';
import { CreateGuardianDto } from './create-guardian.dto';

export class CreateStudentDto {
  @ApiProperty({ description: 'First name of the student' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Middle name of the student', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Last name of the student' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Date of birth of the student' })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ description: 'Gender of the student', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Email address of the student', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the student', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({ description: 'Address of the student', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'City of residence', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State/province of residence', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal/ZIP code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Country of residence', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Nationality of the student', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Student ID number (school-specific)' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Grade level or year of study' })
  @IsString()
  gradeLevel: string;

  @ApiProperty({ description: 'Class or section ID', required: false })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiProperty({ description: 'Enrollment date' })
  @IsDate()
  @Type(() => Date)
  enrollmentDate: Date;

  @ApiProperty({ description: 'Graduation date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  graduationDate?: Date;

  @ApiProperty({ description: 'Status of the student', enum: StudentStatus })
  @IsEnum(StudentStatus)
  status: StudentStatus;

  @ApiProperty({ description: 'Emergency contact name', required: false })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiProperty({ description: 'Emergency contact phone', required: false })
  @IsOptional()
  @IsPhoneNumber()
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Emergency contact relationship', required: false })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @ApiProperty({ description: 'Medical information or notes', required: false })
  @IsOptional()
  @IsString()
  medicalInformation?: string;

  @ApiProperty({ description: 'Special needs or accommodations', required: false })
  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Profile photo URL', required: false })
  @IsOptional()
  @IsUrl()
  profilePhotoUrl?: string;

  @ApiProperty({ description: 'User ID if student has system access', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Guardians associated with this student', type: [CreateGuardianDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => CreateGuardianDto)
  guardians?: CreateGuardianDto[];
}

