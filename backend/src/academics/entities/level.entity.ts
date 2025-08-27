import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Class } from './class.entity';

@Entity('levels')
export class Level extends BaseEntity {
  @ApiProperty({ description: 'Level name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Level code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Level description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Level rank (for sorting)' })
  @Column({ default: 0 })
  rank: number;

  @ApiProperty({ description: 'Level status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Classes in this level' })
  @OneToMany(() => Class, cls => cls.level)
  classes: Class[];
}

