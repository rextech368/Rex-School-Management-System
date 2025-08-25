import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  async log(actorId: number, action: string, entity: string, entityId: number, meta?: any) {
    await this.repo.save({ actor_id: actorId, action, entity, entity_id: entityId, meta });
  }
}

// In RegistrationsService: audit.log(adminId, 'accept_registration', 'Registration', reg.id, { ... });