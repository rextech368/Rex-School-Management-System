export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  FEE = 'fee',
  SCHOLARSHIP = 'scholarship',
  FINANCIAL_AID = 'financial_aid',
  DISCOUNT = 'discount',
  OTHER = 'other'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
  ONLINE_PAYMENT = 'online_payment',
  MOBILE_PAYMENT = 'mobile_payment',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing'
}

export enum FeeType {
  TUITION = 'tuition',
  REGISTRATION = 'registration',
  EXAM = 'exam',
  LIBRARY = 'library',
  LABORATORY = 'laboratory',
  TRANSPORTATION = 'transportation',
  ACCOMMODATION = 'accommodation',
  ACTIVITY = 'activity',
  TECHNOLOGY = 'technology',
  SPORTS = 'sports',
  GRADUATION = 'graduation',
  LATE_PAYMENT = 'late_payment',
  OTHER = 'other'
}

export enum FeeFrequency {
  ONE_TIME = 'one_time',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMESTER = 'semester',
  ANNUAL = 'annual',
  CUSTOM = 'custom'
}

export enum FeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  VOID = 'void'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  referenceNumber?: string;
  invoiceId?: string;
  feeId?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface Fee {
  id: string;
  name: string;
  description?: string;
  type: FeeType;
  amount: number;
  currency: string;
  frequency: FeeFrequency;
  dueDate?: string;
  applicableTo: {
    gradeLevel?: number[];
    class?: string[];
    student?: string[];
    all: boolean;
  };
  status: FeeStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discounts: InvoiceDiscount[];
  tax?: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface InvoiceItem {
  id: string;
  feeId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: FeeType;
}

export interface InvoiceDiscount {
  id: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  amount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  status: PaymentStatus;
  referenceNumber?: string;
  notes?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  paymentId: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  reason: string;
  refundMethod: PaymentMethod;
  refundDate: string;
  status: PaymentStatus;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface FinancialAccount {
  id: string;
  studentId: string;
  studentName: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description?: string;
  type: 'full' | 'partial' | 'merit' | 'need_based' | 'athletic' | 'other';
  amount?: number;
  percentage?: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  criteria?: string;
  fundingSource?: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  studentId: string;
  studentName: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  approvedAmount?: number;
  approvedPercentage?: number;
  currency?: string;
  reviewedBy?: string;
  reviewDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalOutstanding: number;
  totalPaid: number;
  totalRefunded: number;
  totalScholarships: number;
  totalDiscounts: number;
  revenueByFeeType: {
    type: FeeType;
    amount: number;
    percentage: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
  paymentMethodDistribution: {
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }[];
  outstandingByGradeLevel: {
    gradeLevel: number;
    amount: number;
    percentage: number;
  }[];
  collectionRate: number;
  averagePaymentTime: number; // in days
}

export interface FinancialSettings {
  currency: string;
  currencySymbol: string;
  currencyPosition: 'prefix' | 'suffix';
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ' | '';
  decimalPlaces: number;
  taxRate?: number;
  taxName?: string;
  invoicePrefix: string;
  receiptPrefix: string;
  invoiceTerms?: string;
  invoiceNotes?: string;
  paymentMethods: PaymentMethod[];
  lateFeeSettings?: {
    enabled: boolean;
    type: DiscountType;
    value: number;
    gracePeriod: number; // in days
    maxCharges?: number;
  };
  reminderSettings?: {
    enabled: boolean;
    firstReminder: number; // days before due date
    secondReminder: number; // days before due date
    overdueReminder: number; // days after due date
    recurringReminder: number; // days to wait before sending another reminder
  };
}

