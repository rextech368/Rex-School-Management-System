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
  recordedBy?: string;
  recordedAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  tardyDays: number;
  excusedDays: number;
  presentPercentage: number;
  absentPercentage: number;
  tardyPercentage: number;
  excusedPercentage: number;
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
  status?: 'submitted' | 'missing' | 'excused' | 'incomplete';
  recordedBy?: string;
  recordedAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface GradeRecord {
  studentId: string;
  score: number | null;
  comments?: string;
  status?: 'submitted' | 'missing' | 'excused' | 'incomplete';
}

export interface GradeSummary {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  letterGrade: string;
  gpa?: number;
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
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
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
    percentage: number;
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

// Communication System Types

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: Role;
  recipientAvatar?: string;
  subject: string;
  content: string;
  attachments?: Attachment[];
  isRead: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: Role;
    avatar?: string;
  }[];
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  authorAvatar?: string;
  targetAudience: AnnouncementAudience;
  targetIds?: string[]; // Class IDs, grade levels, etc.
  attachments?: Attachment[];
  isPinned: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export enum AnnouncementAudience {
  ALL = 'all',
  STAFF = 'staff',
  TEACHERS = 'teachers',
  STUDENTS = 'students',
  PARENTS = 'parents',
  CLASSES = 'classes',
  GRADE_LEVELS = 'grade_levels'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string; // ID of related entity (grade, attendance, etc.)
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  ANNOUNCEMENT = 'announcement',
  MESSAGE = 'message',
  GRADE = 'grade',
  ATTENDANCE = 'attendance',
  ASSIGNMENT = 'assignment',
  SYSTEM = 'system',
  EVENT = 'event'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Conference {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationPreference {
  userId: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  types: {
    [key in NotificationType]: {
      email: boolean;
      sms: boolean;
      inApp: boolean;
    }
  };
}

