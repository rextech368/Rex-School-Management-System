import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Notifications')
@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('resend/:logId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Resend a failed notification' })
  @ApiParam({ name: 'logId', description: 'Notification log ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification resent successfully'
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification log not found' })
  @HttpCode(HttpStatus.OK)
  resendNotification(@Param('logId', ParseUUIDPipe) logId: string) {
    return this.notificationService.resendNotification(logId);
  }

  @Post('remind/parent/:parentId/exam/:examId')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Send exam reminder to a parent' })
  @ApiParam({ name: 'parentId', description: 'Parent ID' })
  @ApiParam({ name: 'examId', description: 'Exam ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Reminder sent successfully'
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent not found' })
  @HttpCode(HttpStatus.OK)
  sendReminderToParent(
    @Param('parentId', ParseUUIDPipe) parentId: string,
    @Param('examId', ParseUUIDPipe) examId: string
  ) {
    return this.notificationService.sendReminderToParent(parentId, examId);
  }

  @Post('attendance')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  @ApiOperation({ summary: 'Notify parent about student attendance' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        parentId: {
          type: 'string',
          format: 'uuid',
          description: 'Parent ID'
        },
        studentId: {
          type: 'string',
          format: 'uuid',
          description: 'Student ID'
        },
        date: {
          type: 'string',
          format: 'date',
          description: 'Attendance date'
        },
        status: {
          type: 'string',
          description: 'Attendance status (present, absent, late, etc.)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification sent successfully'
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent or student not found' })
  @HttpCode(HttpStatus.OK)
  notifyParentAboutAttendance(
    @Body('parentId') parentId: string,
    @Body('studentId') studentId: string,
    @Body('date') date: string,
    @Body('status') status: string
  ) {
    return this.notificationService.notifyParentAboutAttendance(
      parentId,
      studentId,
      new Date(date),
      status
    );
  }
}

