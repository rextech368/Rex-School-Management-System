import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/organization/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationNotificationController {
  constructor(@InjectRepository(Organization) private orgRepo: Repository<Organization>) {}

  @Get()
  @Roles('Admin')
  async getDefaults(@Req() req) {
    const org = await this.orgRepo.findOneBy({ id: req.user.organization_id });
    return org.notification_defaults || {};
  }

  @Patch()
  @Roles('Admin')
  async setDefaults(@Req() req, @Body() dto: { export_preset_shared?: boolean }) {
    const org = await this.orgRepo.findOneBy({ id: req.user.organization_id });
    org.notification_defaults = { ...org.notification_defaults, ...dto };
    await this.orgRepo.save(org);
    return org.notification_defaults;
  }
}