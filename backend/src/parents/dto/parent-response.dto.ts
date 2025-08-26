import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RelationshipType } from '../entities/parent.entity';
import { StudentResponseDto } from '../../students/dto/student-response.dto';

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

class ParentPreferencesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  attendanceNotifications: boolean;

  @ApiProperty()
  gradeNotifications: boolean;

  @ApiProperty()
  behaviorNotifications: boolean;

  @ApiProperty()
  feeNotifications: boolean;

  @ApiProperty()
  eventNotifications: boolean;

  @ApiProperty()
  assignmentNotifications: boolean;

  @ApiProperty()
  notificationTimePreference: string;

  @ApiProperty()
  weekendNotificationsEnabled: boolean;

  @ApiProperty()
  notificationFrequency: string;

  @ApiProperty()
  dashboardViewPreference: string;
}

export class ParentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  alternativePhoneNumber?: string;

  @ApiProperty({ required: false })
  occupation?: string;

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
  profilePicture?: string;

  @ApiProperty({ required: false })
  nationalIdNumber?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [String] })
  preferredNotificationChannels: string[];

  @ApiProperty()
  whatsappNotificationsEnabled: boolean;

  @ApiProperty()
  smsNotificationsEnabled: boolean;

  @ApiProperty()
  emailNotificationsEnabled: boolean;

  @ApiProperty({ enum: RelationshipType })
  relationshipType: RelationshipType;

  @ApiProperty()
  emergencyContactPriority: number;

  @ApiProperty()
  isAuthorizedForPickup: boolean;

  @ApiProperty()
  hasFinancialResponsibility: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiProperty({ type: [StudentResponseDto], required: false })
  @Type(() => StudentResponseDto)
  students?: StudentResponseDto[];

  @ApiProperty({ type: ParentPreferencesResponseDto, required: false })
  @Type(() => ParentPreferencesResponseDto)
  preferences?: ParentPreferencesResponseDto;

  @Exclude()
  userId?: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;

  @Exclude()
  updatedBy?: string;

  @Exclude()
  deletedBy?: string;
}

