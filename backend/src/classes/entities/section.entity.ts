import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Class } from './class.entity';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

export enum SectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: 0 })
  enrolledStudents: number;

  @Column({
    type: 'enum',
    enum: SectionStatus,
    default: SectionStatus.ACTIVE,
  })
  status: SectionStatus;

  @Column({ nullable: true })
  roomNumber: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  classId: string;

  @ManyToOne(() => Class, cls => cls.sections)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ nullable: true })
  classSectionTeacherId: string;

  @ManyToOne(() => User, user => user.classSectionTeacherSections)
  @JoinColumn({ name: 'classSectionTeacherId' })
  classSectionTeacher: User;

  @OneToMany(() => Student, student => student.currentSection)
  students: Student[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'section_teachers',
    joinColumn: { name: 'sectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  })
  teachers: User[];

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

