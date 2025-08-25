import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Class } from './class.entity';

@Entity({ name: 'sections' })
export class Section {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Class)
  class: Class;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}