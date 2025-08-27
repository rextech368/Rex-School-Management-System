import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Level } from './level.entity';
import { Section } from './section.entity';

@Entity('classes')
export class Class extends BaseEntity {
  @ApiProperty({ description: 'Class name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Class code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Class description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Maximum number of students' })
  @Column({ default: 50 })
  maxStudents: number;

  @ApiProperty({ description: 'Class status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Level ID' })
  @Column({ type: 'uuid' })
  levelId: string;

  @ApiProperty({ description: 'Level' })
  @ManyToOne(() => Level, level => level.classes)
  @JoinColumn({ name: 'levelId' })
  level: Level;

  @ApiProperty({ description: 'Sections in this class' })
  @OneToMany(() => Section, section => section.class)
  sections: Section[];
}

