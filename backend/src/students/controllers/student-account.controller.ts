import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { StudentAccountService } from '../services/student-account.service';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserStatus } from '../../users/entities/user.entity';

@ApiTags('student-accounts')
@Controller('student-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentAccountController {
  constructor(private readonly studentAccountService: StudentAccountService) {}

  @Post('student/:studentId/create-account')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a user account for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        generatePassword: {
          type: 'boolean',
          description: 'Generate a random password',
          default: true,
        },
        sendWelcomeEmail: {
          type: 'boolean',
          description: 'Send welcome email',
          default: true,
        },
        initialStatus: {
          type: 'string',
          enum: Object.values(UserStatus),
          description: 'Initial user status',
          default: UserStatus.PENDING,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user account has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Student already has a user account.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async createStudentAccount(
    @Param('studentId') studentId: string,
    @Body() options: {
      generatePassword?: boolean;
      sendWelcomeEmail?: boolean;
      initialStatus?: UserStatus;
    } = {},
  ): Promise<UserResponseDto> {
    try {
      const user = await this.studentAccountService.createStudentAccount(studentId, options);
      return this.mapToResponseDto(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('parent/:parentId/create-account')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a user account for a parent' })
  @ApiParam({ name: 'parentId', description: 'Parent ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        generatePassword: {
          type: 'boolean',
          description: 'Generate a random password',
          default: true,
        },
        sendWelcomeEmail: {
          type: 'boolean',
          description: 'Send welcome email',
          default: true,
        },
        initialStatus: {
          type: 'string',
          enum: Object.values(UserStatus),
          description: 'Initial user status',
          default: UserStatus.PENDING,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user account has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Parent already has a user account.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async createParentAccount(
    @Param('parentId') parentId: string,
    @Body() options: {
      generatePassword?: boolean;
      sendWelcomeEmail?: boolean;
      initialStatus?: UserStatus;
    } = {},
  ): Promise<UserResponseDto> {
    try {
      const user = await this.studentAccountService.createParentAccount(parentId, options);
      return this.mapToResponseDto(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('student/:studentId/link-user/:userId')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Link an existing user account to a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user account has been successfully linked to the student.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User is already linked to another student.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student or user not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async linkStudentToUser(
    @Param('studentId') studentId: string,
    @Param('userId') userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.studentAccountService.linkStudentToUser(studentId, userId);
      return { success: true, message: 'User account successfully linked to student' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('parent/:parentId/link-user/:userId')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Link an existing user account to a parent' })
  @ApiParam({ name: 'parentId', description: 'Parent ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user account has been successfully linked to the parent.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User is already linked to another parent.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent or user not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async linkParentToUser(
    @Param('parentId') parentId: string,
    @Param('userId') userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.studentAccountService.linkParentToUser(parentId, userId);
      return { success: true, message: 'User account successfully linked to parent' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete('student/:studentId/unlink-user')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Unlink a user account from a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user account has been successfully unlinked from the student.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Student is not linked to any user account.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Student not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async unlinkStudentFromUser(
    @Param('studentId') studentId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.studentAccountService.unlinkStudentFromUser(studentId);
      return { success: true, message: 'User account successfully unlinked from student' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete('parent/:parentId/unlink-user')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Unlink a user account from a parent' })
  @ApiParam({ name: 'parentId', description: 'Parent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user account has been successfully unlinked from the parent.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Parent is not linked to any user account.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async unlinkParentFromUser(
    @Param('parentId') parentId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.studentAccountService.unlinkParentFromUser(parentId);
      return { success: true, message: 'User account successfully unlinked from parent' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(user: any): UserResponseDto {
    const responseDto = new UserResponseDto();
    Object.assign(responseDto, user);
    return responseDto;
  }
}

