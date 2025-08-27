import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Level } from './level.entity';

@Entity('subjects')
export class Subject extends BaseEntity {
  @ApiProperty({ description: 'Subject name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Subject code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Subject description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Subject type' })
  @Column({ default: 'core' })
  type: string;

  @ApiProperty({ description: 'Subject status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Levels this subject is taught in' })
  @ManyToMany(() => Level)
  @JoinTable({
    name: 'subject_levels',
    joinColumn: { name: 'subjectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'levelId', referencedColumnName: 'id' },
  })
  levels: Level[];
}

