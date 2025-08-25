import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/users/me/notifications')
@UseGuards(JwtAuthGuard)
export class UserNotificationController {
  @Patch('preset-override')
  async setPresetOverride(@Req() req, @Body() dto: { presetId: number, shared: boolean|null }) {
    const user = req.user;
    user.notification_preferences = user.notification_preferences || {};
    user.notification_preferences.export_preset_overrides = user.notification_preferences.export_preset_overrides || {};
    if (dto.shared === null) {
      delete user.notification_preferences.export_preset_overrides[dto.presetId];
    } else {
      user.notification_preferences.export_preset_overrides[dto.presetId] = { shared: dto.shared };
    }
    await user.save();
    return user.notification_preferences;
  }
}