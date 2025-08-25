import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { HelperService } from '../common/helper.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private helperService: HelperService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await this.helperService.comparePassword(
      password,
      user.password,
    );
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Return success even if user doesn't exist for security reasons
      return { message: 'Password reset instructions sent to your email' };
    }
    
    // Generate reset token
    const resetToken = this.helperService.generateRandomString(32);
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour
    
    // Save reset token to user
    await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpiry);
    
    // TODO: Send email with reset token
    // For now, just return the token for testing purposes
    return {
      message: 'Password reset instructions sent to your email',
      resetToken, // Remove this in production
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    
    const user = await this.usersService.findByResetToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    
    // Check if token is expired
    const now = new Date();
    if (user.resetTokenExpiry < now) {
      throw new UnauthorizedException('Reset token has expired');
    }
    
    // Hash new password
    const hashedPassword = await this.helperService.hashPassword(password);
    
    // Update user password and clear reset token
    await this.usersService.updatePassword(user.id, hashedPassword);
    
    return { message: 'Password has been reset successfully' };
  }
}

