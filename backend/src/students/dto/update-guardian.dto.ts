import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsPhoneNumber,
  IsUUID,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGuardianDto {
  @ApiProperty({ description: 'Full name of the guardian', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Relationship to the student', required: false })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({ description: 'Email address of the guardian', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the guardian', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({ description: 'Alternative phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  alternativePhoneNumber?: string;

  @ApiProperty({ description: 'Address of the guardian', required: false })
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

  @ApiProperty({ description: 'Occupation of the guardian', required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ description: 'Employer name', required: false })
  @IsOptional()
  @IsString()
  employer?: string;

  @ApiProperty({ description: 'Whether this is the primary guardian', required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({ description: 'Whether this guardian has emergency contact privileges', required: false })
  @IsOptional()
  @IsBoolean()
  isEmergencyContact?: boolean;

  @ApiProperty({ description: 'Whether this guardian has pickup authorization', required: false })
  @IsOptional()
  @IsBoolean()
  hasPickupAuthorization?: boolean;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'User ID if guardian has system access', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

