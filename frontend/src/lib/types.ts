export enum Role {
  ADMIN = 'admin',
  REGISTRAR = 'registrar',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  GUEST = 'guest'
}

export enum TermType {
  SEMESTER = 'semester',
  QUARTER = 'quarter',
  TRIMESTER = 'trimester',
  SUMMER = 'summer',
  WINTER = 'winter',
  YEAR = 'year'
}

export enum DayOfWeek {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday'
}

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  WAITLISTED = 'waitlisted',
  DROPPED = 'dropped',
  COMPLETED = 'completed'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Term {
  id: string;
  name: string;
  code: string;
  type: TermType;
  startDate: string;
  endDate: string;
  registrationStart?: string;
  registrationEnd?: string;
  isActive: boolean;
  isCurrent: boolean;
  description?: string;
  academicYear?: string;
  events?: any[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  department?: string;
  prerequisites?: string[];
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  building?: string;
}

export interface Class {
  id: string;
  courseId: string;
  course?: Course;
  termId: string;
  term?: Term;
  section: string;
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
  teacherId?: string;
  teacher?: Teacher;
  room?: string;
  building?: string;
  schedules?: ClassSchedule[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel?: number;
  dateOfBirth?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  currentEnrollments?: Enrollment[];
  waitlistedClasses?: Enrollment[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  student?: Student;
  classId: string;
  class?: Class;
  status: EnrollmentStatus;
  enrollmentDate: string;
  grade?: string;
  prerequisitesMet?: boolean;
}

