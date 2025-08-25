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
  actor: User;

  @Column()
  action: string;

  @Column({ nullable: true })
  target_user_id: number;

  @Column({ nullable: true })
  target_role: string;

  @CreateDateColumn()
  created_at: Date;
}