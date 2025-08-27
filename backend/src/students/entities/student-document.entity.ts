import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from './student.entity';

@Entity('student_documents')
export class StudentDocument extends BaseEntity {
  @ApiProperty({ description: 'Student ID' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ApiProperty({ description: 'Student', type: () => Student })
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Document title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Document type (e.g., birth certificate, transcript)' })
  @Column()
  documentType: string;

  @ApiProperty({ description: 'Document file URL' })
  @Column()
  fileUrl: string;

  @ApiProperty({ description: 'Original filename' })
  @Column()
  filename: string;

  @ApiProperty({ description: 'File MIME type' })
  @Column()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @Column({ type: 'integer' })
  fileSize: number;

  @ApiProperty({ description: 'Upload date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadDate: Date;

  @ApiProperty({ description: 'Document expiry date', required: false })
  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ description: 'Document verification status' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Verification date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  verificationDate?: Date;

  @ApiProperty({ description: 'User ID who verified the document', required: false })
  @Column({ nullable: true })
  verifiedBy?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;
}

