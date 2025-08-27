import apiClient from './api-client';
import {
  Invoice,
  Payment,
  Fee,
  CreateInvoiceDto,
  CreatePaymentDto,
  CreateFeeDto,
  UpdateInvoiceDto,
  UpdatePaymentDto,
  UpdateFeeDto,
  InvoiceFilters,
  PaymentFilters,
  FeeFilters,
  FinancialSummary,
  StudentFinancialRecord,
} from '@/types/finance';

/**
 * Invoice API functions
 */
export const invoiceApi = {
  /**
   * Get all invoices with optional filters
   */
  getInvoices: async (filters?: InvoiceFilters, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    
    const response = await apiClient.get<{ data: Invoice[]; total: number; page: number; limit: number }>(
      `/invoices?${queryParams.toString()}`
    );
    
    return response.data;
  },
  
  /**
   * Get a single invoice by ID
   */
  getInvoice: async (id: string) => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },
  
  /**
   * Create a new invoice
   */
  createInvoice: async (data: CreateInvoiceDto) => {
    const response = await apiClient.post<Invoice>('/invoices', data);
    return response.data;
  },
  
  /**
   * Update an existing invoice
   */
  updateInvoice: async (id: string, data: UpdateInvoiceDto) => {
    const response = await apiClient.put<Invoice>(`/invoices/${id}`, data);
    return response.data;
  },
  
  /**
   * Delete an invoice
   */
  deleteInvoice: async (id: string) => {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  },
  
  /**
   * Get invoices for a specific student
   */
  getStudentInvoices: async (studentId: string) => {
    const response = await apiClient.get<Invoice[]>(`/students/${studentId}/invoices`);
    return response.data;
  },
};

/**
 * Payment API functions
 */
export const paymentApi = {
  /**
   * Get all payments with optional filters
   */
  getPayments: async (filters?: PaymentFilters, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    
    const response = await apiClient.get<{ data: Payment[]; total: number; page: number; limit: number }>(
      `/payments?${queryParams.toString()}`
    );
    
    return response.data;
  },
  
  /**
   * Get a single payment by ID
   */
  getPayment: async (id: string) => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  
  /**
   * Create a new payment
   */
  createPayment: async (data: CreatePaymentDto) => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
  
  /**
   * Update an existing payment
   */
  updatePayment: async (id: string, data: UpdatePaymentDto) => {
    const response = await apiClient.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },
  
  /**
   * Delete a payment
   */
  deletePayment: async (id: string) => {
    const response = await apiClient.delete(`/payments/${id}`);
    return response.data;
  },
  
  /**
   * Get payments for a specific invoice
   */
  getInvoicePayments: async (invoiceId: string) => {
    const response = await apiClient.get<Payment[]>(`/invoices/${invoiceId}/payments`);
    return response.data;
  },
  
  /**
   * Get payments for a specific student
   */
  getStudentPayments: async (studentId: string) => {
    const response = await apiClient.get<Payment[]>(`/students/${studentId}/payments`);
    return response.data;
  },
};

/**
 * Fee API functions
 */
export const feeApi = {
  /**
   * Get all fees with optional filters
   */
  getFees: async (filters?: FeeFilters, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    
    const response = await apiClient.get<{ data: Fee[]; total: number; page: number; limit: number }>(
      `/fees?${queryParams.toString()}`
    );
    
    return response.data;
  },
  
  /**
   * Get a single fee by ID
   */
  getFee: async (id: string) => {
    const response = await apiClient.get<Fee>(`/fees/${id}`);
    return response.data;
  },
  
  /**
   * Create a new fee
   */
  createFee: async (data: CreateFeeDto) => {
    const response = await apiClient.post<Fee>('/fees', data);
    return response.data;
  },
  
  /**
   * Update an existing fee
   */
  updateFee: async (id: string, data: UpdateFeeDto) => {
    const response = await apiClient.put<Fee>(`/fees/${id}`, data);
    return response.data;
  },
  
  /**
   * Delete a fee
   */
  deleteFee: async (id: string) => {
    const response = await apiClient.delete(`/fees/${id}`);
    return response.data;
  },
  
  /**
   * Get fees for a specific grade level
   */
  getGradeFees: async (gradeLevel: string) => {
    const response = await apiClient.get<Fee[]>(`/grades/${gradeLevel}/fees`);
    return response.data;
  },
};

/**
 * Finance summary API functions
 */
export const financeSummaryApi = {
  /**
   * Get financial summary
   */
  getFinancialSummary: async () => {
    const response = await apiClient.get<FinancialSummary>('/finance/summary');
    return response.data;
  },
  
  /**
   * Get financial record for a specific student
   */
  getStudentFinancialRecord: async (studentId: string) => {
    const response = await apiClient.get<StudentFinancialRecord>(`/finance/students/${studentId}`);
    return response.data;
  },
};

