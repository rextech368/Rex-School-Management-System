import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ExportPreset } from './export-preset.entity';
import { User } from '../users/entities/user.entity';

@Entity({ name: 'export_preset_audits' })
export class ExportPresetAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExportPreset)
  preset: ExportPreset;

  @ManyToOne(() => User)
  actor: User; // Who performed the action

  @Column()
  action: string; // e.g., 'shared_with_user', 'unshared_with_user', 'shared_with_role', 'unshared_with_role'

  @Column({ nullable: true })
  target_user_id: number;

  @Column({ nullable: true })
  target_role: string;

  @CreateDateColumn()
  created_at: Date;
}