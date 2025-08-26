// User roles
export enum Role {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  REGISTRAR = 'registrar',
  STAFF = 'staff'
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Student interface
export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gradeLevel: number;
  guardianId?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalInformation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course interface
export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  department: string;
  credits: number;
  gradeLevel: number[] | number;
  prerequisites?: string[];
  syllabus?: string;
  materials?: CourseMaterial[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Course material interface
export interface CourseMaterial {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
}

// Term interface
export interface Term {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  type: TermType;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Term type enum
export enum TermType {
  SEMESTER = 'semester',
  QUARTER = 'quarter',
  TRIMESTER = 'trimester',
  YEAR = 'year',
  SUMMER = 'summer',
  OTHER = 'other'
}

// Class interface
export interface Class {
  id: string;
  courseId: string;
  course?: Course;
  termId: string;
  term?: Term;
  teacherId?: string;
  teacher?: User;
  section: string;
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
  room?: string;
  building?: string;
  schedules?: ClassSchedule[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Class schedule interface
export interface ClassSchedule {
  id: string;
  classId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  building?: string;
}

// Day of week enum
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

// Enrollment interface
export interface Enrollment {
  id: string;
  classId: string;
  class?: Class;
  studentId: string;
  student?: Student;
  enrollmentDate: string;
  status: EnrollmentStatus;
  grade?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enrollment status enum
export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  WAITLISTED = 'waitlisted',
  DROPPED = 'dropped',
  COMPLETED = 'completed'
}

// Attendance interface
export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Attendance status enum
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  TARDY = 'tardy',
  EXCUSED = 'excused'
}

