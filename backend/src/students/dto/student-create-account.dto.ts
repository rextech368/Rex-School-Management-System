import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../../users/entities/user.entity';

export class StudentCreateAccountDto {
  @ApiProperty({
    description: 'Generate a random password',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  generatePassword?: boolean = true;

  @ApiProperty({
    description: 'Send welcome email',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  sendWelcomeEmail?: boolean = true;

  @ApiProperty({
    description: 'Initial user status',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  initialStatus?: UserStatus = UserStatus.PENDING;
}

