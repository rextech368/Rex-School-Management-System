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

// Reporting and Analytics Types

export interface Report {
  id: string;
  title: string;
  description?: string;
  type: ReportType;
  parameters: ReportParameter[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  lastRunAt?: string;
  schedule?: ReportSchedule;
  isPublic: boolean;
  accessRoles?: Role[];
}

export enum ReportType {
  ATTENDANCE = 'attendance',
  GRADES = 'grades',
  ENROLLMENT = 'enrollment',
  STUDENT_PERFORMANCE = 'student_performance',
  TEACHER_PERFORMANCE = 'teacher_performance',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export interface ReportParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6, Sunday to Saturday
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  recipients: string[]; // Email addresses
  active: boolean;
  lastSentAt?: string;
}

export interface ReportResult {
  id: string;
  reportId: string;
  parameters: { [key: string]: any };
  data: any;
  format: 'json' | 'csv' | 'pdf' | 'excel';
  generatedAt: string;
  generatedBy: string;
  downloadUrl?: string;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isDefault: boolean;
  isPublic: boolean;
  accessRoles?: Role[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  dataSource: DataSource;
  parameters: { [key: string]: any };
  settings: { [key: string]: any };
  refreshInterval?: number; // in minutes
}

export enum WidgetType {
  CHART = 'chart',
  TABLE = 'table',
  METRIC = 'metric',
  LIST = 'list',
  CALENDAR = 'calendar',
  CUSTOM = 'custom'
}

export interface DashboardLayout {
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DataSource {
  type: 'api' | 'report' | 'custom';
  endpoint?: string;
  reportId?: string;
  customQuery?: string;
  refreshInterval?: number; // in minutes
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  trend?: number;
  trendPeriod?: string;
  status?: 'positive' | 'negative' | 'neutral';
  target?: number;
  icon?: string;
  color?: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'scatter' | 'area';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
  options?: any;
}

export interface TableData {
  columns: {
    field: string;
    headerName: string;
    type?: 'string' | 'number' | 'date' | 'boolean';
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    renderCell?: (value: any) => any;
  }[];
  rows: any[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface AttendanceAnalytics {
  overall: {
    presentRate: number;
    absentRate: number;
    tardyRate: number;
    excusedRate: number;
    trend: number;
  };
  byClass: {
    classId: string;
    className: string;
    presentRate: number;
    absentRate: number;
    tardyRate: number;
    excusedRate: number;
  }[];
  byGradeLevel: {
    gradeLevel: number;
    presentRate: number;
    absentRate: number;
    tardyRate: number;
    excusedRate: number;
  }[];
  byTimeOfYear: {
    month: string;
    presentRate: number;
    absentRate: number;
    tardyRate: number;
    excusedRate: number;
  }[];
  byDayOfWeek: {
    day: string;
    presentRate: number;
    absentRate: number;
    tardyRate: number;
    excusedRate: number;
  }[];
}

export interface GradeAnalytics {
  overall: {
    averageGrade: number;
    medianGrade: number;
    passingRate: number;
    failingRate: number;
    trend: number;
  };
  byClass: {
    classId: string;
    className: string;
    averageGrade: number;
    medianGrade: number;
    passingRate: number;
    failingRate: number;
  }[];
  byGradeLevel: {
    gradeLevel: number;
    averageGrade: number;
    medianGrade: number;
    passingRate: number;
    failingRate: number;
  }[];
  byAssignmentType: {
    type: string;
    averageGrade: number;
    medianGrade: number;
    passingRate: number;
    failingRate: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
}

export interface EnrollmentAnalytics {
  overall: {
    totalStudents: number;
    newStudents: number;
    withdrawnStudents: number;
    retentionRate: number;
    trend: number;
  };
  byGradeLevel: {
    gradeLevel: number;
    totalStudents: number;
    newStudents: number;
    withdrawnStudents: number;
    retentionRate: number;
  }[];
  byClass: {
    classId: string;
    className: string;
    totalStudents: number;
    waitlistedStudents: number;
    capacityUtilization: number;
  }[];
  byTerm: {
    termId: string;
    termName: string;
    totalStudents: number;
    newStudents: number;
    withdrawnStudents: number;
    retentionRate: number;
  }[];
  demographics: {
    gender: {
      category: string;
      count: number;
      percentage: number;
    }[];
    age: {
      category: string;
      count: number;
      percentage: number;
    }[];
    location: {
      category: string;
      count: number;
      percentage: number;
    }[];
  };
}

export interface StudentPerformanceAnalytics {
  overall: {
    averageGPA: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
    trend: number;
  };
  topPerformers: {
    studentId: string;
    studentName: string;
    gpa: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
  }[];
  needsImprovement: {
    studentId: string;
    studentName: string;
    gpa: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  bySubject: {
    subject: string;
    averageGrade: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
  }[];
  progressOverTime: {
    period: string;
    averageGPA: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
  }[];
}

export interface TeacherPerformanceAnalytics {
  overall: {
    averageStudentGrades: number;
    studentAttendanceRate: number;
    studentSatisfactionRate?: number;
    classesCount: number;
    studentsCount: number;
  };
  byTeacher: {
    teacherId: string;
    teacherName: string;
    averageStudentGrades: number;
    studentAttendanceRate: number;
    studentSatisfactionRate?: number;
    classesCount: number;
    studentsCount: number;
  }[];
  byDepartment: {
    department: string;
    averageStudentGrades: number;
    studentAttendanceRate: number;
    studentSatisfactionRate?: number;
    teachersCount: number;
    classesCount: number;
    studentsCount: number;
  }[];
  byTerm: {
    termId: string;
    termName: string;
    averageStudentGrades: number;
    studentAttendanceRate: number;
    studentSatisfactionRate?: number;
  }[];
}

export interface SchoolOverviewAnalytics {
  students: {
    total: number;
    byGradeLevel: { gradeLevel: number; count: number }[];
    byStatus: { status: string; count: number }[];
    trend: { period: string; count: number }[];
  };
  teachers: {
    total: number;
    byDepartment: { department: string; count: number }[];
    byStatus: { status: string; count: number }[];
    trend: { period: string; count: number }[];
  };
  classes: {
    total: number;
    byStatus: { status: string; count: number }[];
    byDepartment: { department: string; count: number }[];
    capacityUtilization: number;
  };
  attendance: {
    overallRate: number;
    byGradeLevel: { gradeLevel: number; rate: number }[];
    trend: { period: string; rate: number }[];
  };
  grades: {
    averageGPA: number;
    passingRate: number;
    byGradeLevel: { gradeLevel: number; averageGPA: number; passingRate: number }[];
    trend: { period: string; averageGPA: number; passingRate: number }[];
  };
  keyMetrics: AnalyticsMetric[];
}

