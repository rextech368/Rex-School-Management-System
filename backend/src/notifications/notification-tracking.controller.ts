import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentNotificationLog } from '../parents/entities/parent-notification-log.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Controller('api/v1/notifications/track')
export class NotificationTrackingController {
  constructor(
    @InjectRepository(ParentNotificationLog) private logRepo: Repository<ParentNotificationLog>
  ) {}

  @Get('open')
  async trackOpen(@Query('id') id: string, @Res() res: Response) {
    const log = await this.logRepo.findOne({ where: { id } });
    if (log && log.status !== 'opened') {
      log.status = 'opened';
      log.opened_at = new Date();
      await this.logRepo.save(log);
    }
    // Return a 1x1 transparent pixel
    const img = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
      'base64'
    );
    res.set('Content-Type', 'image/png');
    res.send(img);
  }

  @Get('click')
  @Redirect()
  async trackClick(@Query('id') id: string, @Query('url') url: string) {
    const log = await this.logRepo.findOne({ where: { id } });
    if (log) {
      log.status = 'clicked';
      log.clicked_at = new Date();
      await this.logRepo.save(log);
    }
    return { url: decodeURIComponent(url) };
  }
}