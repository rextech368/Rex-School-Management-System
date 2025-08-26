import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ 
    description: 'Current password', 
    example: 'CurrentP@ssw0rd' 
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ 
    description: 'New password', 
    example: 'NewStrongP@ssw0rd' 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  newPassword: string;

  @ApiProperty({ 
    description: 'Confirm new password', 
    example: 'NewStrongP@ssw0rd' 
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

