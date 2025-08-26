import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Section } from './section.entity';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { AcademicYear } from '../../academic/entities/academic-year.entity';
import { Subject } from '../../academic/entities/subject.entity';

export enum ClassStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: 0 })
  enrolledStudents: number;

  @Column({
    type: 'enum',
    enum: ClassStatus,
    default: ClassStatus.ACTIVE,
  })
  status: ClassStatus;

  @Column({ nullable: true })
  roomNumber: string;

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  floor: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  academicYearId: string;

  @ManyToOne(() => AcademicYear, academicYear => academicYear.classes)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYear;

  @Column({ nullable: true })
  headTeacherId: string;

  @ManyToOne(() => User, user => user.headTeacherClasses)
  @JoinColumn({ name: 'headTeacherId' })
  headTeacher: User;

  @OneToMany(() => Section, section => section.class)
  sections: Section[];

  @OneToMany(() => Student, student => student.currentClass)
  students: Student[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'class_teachers',
    joinColumn: { name: 'classId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  })
  teachers: User[];

  @ManyToMany(() => Subject)
  @JoinTable({
    name: 'class_subjects',
    joinColumn: { name: 'classId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subjectId', referencedColumnName: 'id' },
  })
  subjects: Subject[];

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

