import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Level } from './level.entity';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Level)
  level: Level;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50.0 })
  default_promotion_threshold: number;

  @Column({ name: 'group_type', type: 'varchar', length: 20 })
  group_type: 'Primary' | 'Secondary';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}