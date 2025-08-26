import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsUUID, 
  IsArray,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParentRelationship } from '../../entities/parent.entity';

export class CreateParentDto {
  @ApiProperty({ description: 'Parent first name', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Parent last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Parent email address', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Parent phone number', example: '+237612345678' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Alternative phone number', required: false, example: '+237612345679' })
  @IsOptional()
  @IsString()
  alternativePhoneNumber?: string;

  @ApiProperty({ description: 'Parent address', required: false, example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Parent city', required: false, example: 'Douala' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Parent state/province', required: false, example: 'Littoral' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Parent country', required: false, example: 'Cameroon' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Parent postal code', required: false, example: '00237' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Parent occupation', required: false, example: 'Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ description: 'Parent employer', required: false, example: 'Tech Company Ltd' })
  @IsOptional()
  @IsString()
  employer?: string;

  @ApiProperty({ 
    description: 'Parent relationship to student', 
    enum: ParentRelationship, 
    example: ParentRelationship.FATHER 
  })
  @IsEnum(ParentRelationship)
  relationship: ParentRelationship;

  @ApiProperty({ description: 'Is emergency contact', default: false })
  @IsOptional()
  @IsBoolean()
  isEmergencyContact?: boolean;

  @ApiProperty({ description: 'Is authorized to pick up student', default: false })
  @IsOptional()
  @IsBoolean()
  isAuthorizedToPickup?: boolean;

  @ApiProperty({ description: 'Receives school communications', default: true })
  @IsOptional()
  @IsBoolean()
  receivesSchoolCommunications?: boolean;

  @ApiProperty({ description: 'Has portal access', default: true })
  @IsOptional()
  @IsBoolean()
  hasPortalAccess?: boolean;

  @ApiProperty({ description: 'National ID number', required: false, example: 'ID12345678' })
  @IsOptional()
  @IsString()
  nationalIdNumber?: string;

  @ApiProperty({ description: 'Profile picture URL', required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: 'Notes about the parent', required: false, example: 'Prefers to be contacted by email' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'User ID for parent account', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Student IDs to associate with parent', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];

  @ApiProperty({ description: 'Create user account for parent', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  createUserAccount?: boolean;
}

