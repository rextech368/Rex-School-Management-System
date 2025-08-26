import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsUUID,
  IsBoolean,
  MaxLength,
  MinLength,
  ArrayMinSize,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RelationshipType } from '../entities/parent.entity';

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

  @ApiProperty({ description: 'Parent occupation', required: false, example: 'Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

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

  @ApiProperty({ description: 'Parent profile picture URL', required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: 'National ID number', required: false, example: 'ID12345678' })
  @IsOptional()
  @IsString()
  nationalIdNumber?: string;

  @ApiProperty({ description: 'Parent status', default: 'active', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ 
    description: 'Preferred notification channels', 
    type: [String], 
    default: ['email'],
    example: ['email', 'sms']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredNotificationChannels?: string[];

  @ApiProperty({ description: 'WhatsApp notification enabled', default: false, example: true })
  @IsOptional()
  @IsBoolean()
  whatsappNotificationsEnabled?: boolean;

  @ApiProperty({ description: 'SMS notification enabled', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  smsNotificationsEnabled?: boolean;

  @ApiProperty({ description: 'Email notification enabled', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  emailNotificationsEnabled?: boolean;

  @ApiProperty({ description: 'User ID for parent account', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Student IDs to associate with parent', type: [String], example: ['uuid1', 'uuid2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  studentIds: string[];

  @ApiProperty({ 
    description: 'Relationship type with students', 
    enum: RelationshipType, 
    default: RelationshipType.GUARDIAN,
    example: RelationshipType.FATHER
  })
  @IsEnum(RelationshipType)
  relationshipType: RelationshipType;

  @ApiProperty({ description: 'Emergency contact priority (1 = primary)', default: 1, example: 1 })
  @IsOptional()
  @IsEnum([1, 2, 3, 4, 5])
  emergencyContactPriority?: number;

  @ApiProperty({ description: 'Is authorized to pick up students', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  isAuthorizedForPickup?: boolean;

  @ApiProperty({ description: 'Has financial responsibility', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  hasFinancialResponsibility?: boolean;

  @ApiProperty({ description: 'Create user account for parent', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  createUserAccount?: boolean;

  @ApiProperty({ description: 'Parent preferences', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ParentPreferencesDto)
  preferences?: ParentPreferencesDto;
}

export class ParentPreferencesDto {
  @ApiProperty({ description: 'Language preference', default: 'en', example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Receive attendance notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  attendanceNotifications?: boolean;

  @ApiProperty({ description: 'Receive grade notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  gradeNotifications?: boolean;

  @ApiProperty({ description: 'Receive behavior notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  behaviorNotifications?: boolean;

  @ApiProperty({ description: 'Receive fee notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  feeNotifications?: boolean;

  @ApiProperty({ description: 'Receive event notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  eventNotifications?: boolean;

  @ApiProperty({ description: 'Receive assignment notifications', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  assignmentNotifications?: boolean;

  @ApiProperty({ description: 'Notification time preference (24h format)', default: '18:00', example: '18:00' })
  @IsOptional()
  @IsString()
  notificationTimePreference?: string;

  @ApiProperty({ description: 'Weekend notifications enabled', default: false, example: false })
  @IsOptional()
  @IsBoolean()
  weekendNotificationsEnabled?: boolean;

  @ApiProperty({ 
    description: 'Notification frequency', 
    default: 'daily', 
    example: 'daily',
    enum: ['immediate', 'daily', 'weekly']
  })
  @IsOptional()
  @IsEnum(['immediate', 'daily', 'weekly'])
  notificationFrequency?: 'immediate' | 'daily' | 'weekly';

  @ApiProperty({ 
    description: 'Dashboard view preference', 
    default: 'summary', 
    example: 'summary',
    enum: ['summary', 'detailed', 'calendar']
  })
  @IsOptional()
  @IsEnum(['summary', 'detailed', 'calendar'])
  dashboardViewPreference?: 'summary' | 'detailed' | 'calendar';
}

