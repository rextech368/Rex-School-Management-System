import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ParentRelationship } from '../../entities/parent.entity';
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

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
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
  occupation?: string;

  @ApiProperty({ required: false })
  employer?: string;

  @ApiProperty({ enum: ParentRelationship })
  relationship: ParentRelationship;

  @ApiProperty()
  isEmergencyContact: boolean;

  @ApiProperty()
  isAuthorizedToPickup: boolean;

  @ApiProperty()
  receivesSchoolCommunications: boolean;

  @ApiProperty()
  hasPortalAccess: boolean;

  @ApiProperty({ required: false })
  nationalIdNumber?: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty({ required: false })
  notes?: string;

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

