import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { SendBulkNotificationDto } from '../dto/send-bulk-notification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { NotificationType } from '../enums/notification-type.enum';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The notification has been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto): Promise<any> {
    return this.notificationService.sendNotification(sendNotificationDto);
  }

  @Post('send-bulk')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send bulk notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The notifications have been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendBulkNotification(@Body() sendBulkNotificationDto: SendBulkNotificationDto): Promise<any> {
    const { recipients, type, context, channels } = sendBulkNotificationDto;
    return this.notificationService.sendBulkNotification(recipients, type, context, channels);
  }

  @Post('welcome')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send a welcome notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The welcome notification has been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendWelcomeNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<any> {
    const { userId, email, phoneNumber, name, context } = sendNotificationDto;
    return this.notificationService.sendWelcomeNotification(
      userId,
      email,
      phoneNumber,
      name,
      context?.password,
      sendNotificationDto.channels,
    );
  }

  @Post('password-reset')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send a password reset notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The password reset notification has been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendPasswordResetNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<any> {
    const { userId, email, phoneNumber, name, context } = sendNotificationDto;
    return this.notificationService.sendPasswordResetNotification(
      userId,
      email,
      phoneNumber,
      name,
      context?.resetToken,
      sendNotificationDto.channels,
    );
  }

  @Post('document-upload')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send a document upload notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document upload notification has been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendDocumentUploadNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<any> {
    const { userId, email, phoneNumber, name, context } = sendNotificationDto;
    return this.notificationService.sendDocumentUploadNotification(
      userId,
      email,
      phoneNumber,
      name,
      context?.documentTitle,
      context?.studentName,
      context?.documentUrl,
      sendNotificationDto.channels,
    );
  }

  @Post('document-verification')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Send a document verification notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The document verification notification has been sent successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async sendDocumentVerificationNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<any> {
    const { userId, email, phoneNumber, name, context } = sendNotificationDto;
    return this.notificationService.sendDocumentVerificationNotification(
      userId,
      email,
      phoneNumber,
      name,
      context?.documentTitle,
      context?.verificationStatus,
      context?.verificationNotes,
      sendNotificationDto.channels,
    );
  }

  @Get('logs')
  @Roles('admin')
  @ApiOperation({ summary: 'Get notification logs' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by notification type', enum: NotificationType })
  @ApiQuery({ name: 'success', required: false, description: 'Filter by success status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return notification logs.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getNotificationLogs(
    @Query('userId') userId?: string,
    @Query('type') type?: NotificationType,
    @Query('success') success?: boolean,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    // This would be implemented in a NotificationLogService
    return { message: 'Not implemented yet' };
  }

  @Get('logs/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get a notification log by ID' })
  @ApiParam({ name: 'id', description: 'Notification log ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the notification log.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification log not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getNotificationLog(@Param('id') id: string): Promise<any> {
    // This would be implemented in a NotificationLogService
    return { message: 'Not implemented yet', id };
  }
}

