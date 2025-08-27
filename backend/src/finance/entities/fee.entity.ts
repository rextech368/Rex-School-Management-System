import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FeeType {
  TUITION = 'tuition',
  REGISTRATION = 'registration',
  EXAM = 'exam',
  LIBRARY = 'library',
  TRANSPORTATION = 'transportation',
  ACCOMMODATION = 'accommodation',
  OTHER = 'other',
}

export enum FeeFrequency {
  ONE_TIME = 'one_time',
  TERM = 'term',
  SEMESTER = 'semester',
  ANNUAL = 'annual',
  MONTHLY = 'monthly',
}

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: FeeType, default: FeeType.TUITION })
  type: FeeType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: FeeFrequency, default: FeeFrequency.TERM })
  frequency: FeeFrequency;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  academicYear: string;

  @Column({ nullable: true })
  term: string;

  @Column({ nullable: true })
  gradeLevel: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdById: string;

  @Column({ nullable: true })
  updatedById: string;

  @Column({ nullable: true })
  organizationId: string;
}

