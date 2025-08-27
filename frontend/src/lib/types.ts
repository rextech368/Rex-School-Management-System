export enum Role {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  REGISTRAR = 'registrar',
  STAFF = 'staff'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  academicYear: string;
  description?: string;
  events?: TermEvent[];
}

export interface TermEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  description?: string;
  type: 'holiday' | 'exam' | 'event' | 'deadline';
  allDay?: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
  credits: number;
  gradeLevel?: number;
  prerequisites?: string[];
  status: 'active' | 'inactive' | 'archived';
}

export interface Class {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  termId: string;
  termName: string;
  teacherId?: string;
  teacherName?: string;
  room?: string;
  schedule?: string;
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  studentId?: string;
  gradeLevel?: number;
  enrollmentDate?: string;
  status?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  guardianAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalInformation?: string;
  notes?: string;
  profileColor?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  teacherId?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  status?: string;
  office?: string;
  officeHours?: string;
  education?: string[];
  certifications?: string[];
  specializations?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  notes?: string;
  profileColor?: string;
  teachingHours?: number;
  classCount?: number;
  studentCount?: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: 'enrolled' | 'waitlisted' | 'dropped' | 'completed';
  enrollmentDate: string;
  grade?: string;
  attendance?: {
    present: number;
    absent: number;
    tardy: number;
  };
}

export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

export interface Grade {
  id: string;
  classId: string;
  studentId: string;
  assignmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade?: string;
  comments?: string;
  dateSubmitted?: string;
  dateGraded?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description?: string;
  type: 'homework' | 'quiz' | 'test' | 'project' | 'other';
  dueDate: string;
  maxScore: number;
  weight: number;
  status: 'draft' | 'published' | 'graded';
}

export interface GradeScale {
  id: string;
  name: string;
  scale: {
    min: number;
    max: number;
    letter: string;
  }[];
}

export interface ReportCard {
  id: string;
  studentId: string;
  termId: string;
  issueDate: string;
  classes: {
    classId: string;
    className: string;
    teacherName: string;
    grade: string;
    comments?: string;
  }[];
  gpa: number;
  attendance: {
    present: number;
    absent: number;
    tardy: number;
  };
  comments?: string;
}

