import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('user-notifications')
@ApiBearerAuth()
@Controller('api/v1/users/me/notifications')
@UseGuards(JwtAuthGuard)
export class UserNotificationController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Return the user notification preferences.' })
  async getNotificationPreferences(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    return user.notification_preferences || {};
  }

  @Patch()
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'The notification preferences have been successfully updated.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notifications: {
          type: 'object',
          properties: {
            emailEnabled: { type: 'boolean' },
            inAppEnabled: { type: 'boolean' },
            smsEnabled: { type: 'boolean' },
            types: {
              type: 'object',
              properties: {
                announcements: { type: 'boolean' },
                grades: { type: 'boolean' },
                attendance: { type: 'boolean' },
                assignments: { type: 'boolean' },
                messages: { type: 'boolean' },
                events: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  async updateNotificationPreferences(@Request() req, @Body() body: { notifications: any }) {
    const updateSettingsDto = {
      notifications: body.notifications,
    };
    
    const updatedUser = await this.usersService.updateSettings(req.user.id, updateSettingsDto);
    return updatedUser.settings?.notifications || {};
  }

  @Patch('preset-override')
  @ApiOperation({ summary: 'Set notification preset override' })
  @ApiResponse({ status: 200, description: 'The preset override has been successfully set.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        presetId: { type: 'number' },
        shared: { type: 'boolean', nullable: true },
      },
    },
  })
  async setPresetOverride(@Request() req, @Body() dto: { presetId: number, shared: boolean|null }) {
    const user = await this.usersService.findOne(req.user.id);
    
    // Initialize notification preferences if they don't exist
    const settings = user.settings || {};
    settings.notifications = settings.notifications || {};
    settings.notifications.export_preset_overrides = settings.notifications.export_preset_overrides || {};
    
    // Update the preset override
    if (dto.shared === null) {
      delete settings.notifications.export_preset_overrides[dto.presetId];
    } else {
      settings.notifications.export_preset_overrides[dto.presetId] = { shared: dto.shared };
    }
    
    // Update user settings
    const updateSettingsDto = { notifications: settings.notifications };
    const updatedUser = await this.usersService.updateSettings(req.user.id, updateSettingsDto);
    
    return updatedUser.settings?.notifications || {};
  }
}

