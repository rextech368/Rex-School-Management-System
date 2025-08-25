import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportPresetAudit } from './export-preset-audit.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response } from 'express';

@Controller('api/v1/export/preset-audits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportPresetAuditController {
  constructor(@InjectRepository(ExportPresetAudit) private auditRepo: Repository<ExportPresetAudit>) {}

  @Get()
  @Roles('Admin')
  async list(
    @Query('presetId') presetId: number,
    @Query('user') userId?: number,
    @Query('action') action?: string,
    @Query('start') start?: string,
    @Query('end') end?: string
  ) {
    const where: any = { preset: { id: presetId } };
    if (userId) where.actor = { id: +userId };
    if (action) where.action = action;
    if (start) where.created_at = { ...(where.created_at || {}), $gte: new Date(start) };
    if (end) where.created_at = { ...(where.created_at || {}), $lte: new Date(end) };

    const options: FindManyOptions<ExportPresetAudit> = {
      where,
      order: { created_at: 'DESC' },
      relations: ['actor'],
    };
    return this.auditRepo.find(options);
  }

  @Get('export')
  @Roles('Admin')
  async exportAuditLogs(
    @Query('presetId') presetId: number,
    @Query('user') userId?: number,
    @Query('action') action?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Res() res: Response
  ) {
    const where: any = { preset: { id: presetId } };
    if (userId) where.actor = { id: +userId };
    if (action) where.action = action;
    if (start) where.created_at = { ...(where.created_at || {}), $gte: new Date(start) };
    if (end) where.created_at = { ...(where.created_at || {}), $lte: new Date(end) };

    const options: FindManyOptions<ExportPresetAudit> = {
      where,
      order: { created_at: 'DESC' },
      relations: ['actor'],
    };
    const logs = await this.auditRepo.find(options);
    const header = ['Timestamp', 'PresetId', 'Action', 'Actor', 'TargetUserId', 'TargetRole'];
    const rows = logs.map(l => [
      l.created_at.toISOString(),
      l.preset.id,
      l.action,
      l.actor?.email || l.actor?.id,
      l.target_user_id || '',
      l.target_role || ''
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="preset_audit_logs_${presetId}.csv"`);
    res.send(csv);
  }
}