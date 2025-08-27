/**
 * Finance module type definitions
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceType {
  TUITION = 'TUITION',
  REGISTRATION = 'REGISTRATION',
  EXAM = 'EXAM',
  TRANSPORTATION = 'TRANSPORTATION',
  UNIFORM = 'UNIFORM',
  BOOKS = 'BOOKS',
  ACTIVITY = 'ACTIVITY',
  OTHER = 'OTHER',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CHECK = 'CHECK',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum FeeType {
  TUITION = 'TUITION',
  REGISTRATION = 'REGISTRATION',
  EXAM = 'EXAM',
  TRANSPORTATION = 'TRANSPORTATION',
  UNIFORM = 'UNIFORM',
  BOOKS = 'BOOKS',
  ACTIVITY = 'ACTIVITY',
  OTHER = 'OTHER',
}

export enum FeeFrequency {
  ONE_TIME = 'ONE_TIME',
  TERM = 'TERM',
  SEMESTER = 'SEMESTER',
  ANNUAL = 'ANNUAL',
  MONTHLY = 'MONTHLY',
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  studentId: string;
  profileImageUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  student: Student;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  balance: number;
  dueDate: string;
  issueDate: string;
  description?: string;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  feeId?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  student: Student;
  invoice?: Invoice;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  receiptNumber?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fee {
  id: string;
  name: string;
  description?: string;
  type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  academicYear: string;
  gradeLevel?: string;
  isRequired: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  studentId: string;
  type: InvoiceType;
  dueDate: string;
  description?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    feeId?: string;
  }[];
}

export interface CreatePaymentDto {
  studentId: string;
  invoiceId?: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  paymentDate: string;
  notes?: string;
}

export interface CreateFeeDto {
  name: string;
  description?: string;
  type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  academicYear: string;
  gradeLevel?: string;
  isRequired: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateInvoiceDto {
  type?: InvoiceType;
  status?: InvoiceStatus;
  dueDate?: string;
  description?: string;
  items?: {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    feeId?: string;
  }[];
}

export interface UpdatePaymentDto {
  method?: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
}

export interface UpdateFeeDto {
  name?: string;
  description?: string;
  type?: FeeType;
  amount?: number;
  frequency?: FeeFrequency;
  academicYear?: string;
  gradeLevel?: string;
  isRequired?: boolean;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface InvoiceFilters {
  studentId?: string;
  status?: InvoiceStatus;
  type?: InvoiceType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentFilters {
  studentId?: string;
  invoiceId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FeeFilters {
  type?: FeeType;
  frequency?: FeeFrequency;
  academicYear?: string;
  gradeLevel?: string;
  isActive?: boolean;
}

export interface FinancialSummary {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  recentPayments: Payment[];
  pendingInvoices: Invoice[];
}

export interface StudentFinancialRecord {
  student: Student;
  totalInvoiced: number;
  totalPaid: number;
  balance: number;
  invoices: Invoice[];
  payments: Payment[];
}

