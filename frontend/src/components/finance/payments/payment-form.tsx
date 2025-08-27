'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  XMarkIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { 
  Payment, 
  PaymentMethod, 
  CreatePaymentDto, 
  UpdatePaymentDto,
  Student,
  Invoice
} from '@/types/finance';
import { paymentApi, invoiceApi } from '@/lib/api/finance-api';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { isNotEmpty, isPositiveNumber } from '@/lib/utils/validation';

interface PaymentFormProps {
  payment?: Payment;
  students: Student[];
  invoiceId?: string;
  studentId?: string;
}

interface FormErrors {
  studentId?: string;
  invoiceId?: string;
  amount?: string;
  method?: string;
  paymentDate?: string;
  general?: string;
}

export default function PaymentForm({ payment, students, invoiceId, studentId }: PaymentFormProps) {
  const router = useRouter();
  const isEditing = !!payment;
  
  const [formData, setFormData] = useState<CreatePaymentDto | UpdatePaymentDto>({
    studentId: payment?.student.id || studentId || '',
    invoiceId: payment?.invoice?.id || invoiceId || '',
    amount: payment?.amount || 0,
    method: payment?.method || PaymentMethod.CASH,
    transactionId: payment?.transactionId || '',
    paymentDate: payment?.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: payment?.notes || '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    payment ? payment.student : students.find(s => s.id === studentId) || null
  );
  const [studentInvoices, setStudentInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  
  // Fetch student invoices when student changes
  useEffect(() => {
    const fetchStudentInvoices = async () => {
      if (!selectedStudent) return;
      
      setIsLoadingInvoices(true);
      
      try {
        const invoices = await invoiceApi.getStudentInvoices(selectedStudent.id);
        setStudentInvoices(invoices);
        
        // If invoiceId is provided, select that invoice
        if (invoiceId) {
          const invoice = invoices.find(inv => inv.id === invoiceId) || null;
          setSelectedInvoice(invoice);
          
          // If invoice is found, set the amount to the balance
          if (invoice) {
            setFormData(prev => ({
              ...prev,
              amount: invoice.balance,
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching student invoices:', err);
      } finally {
        setIsLoadingInvoices(false);
      }
    };
    
    if (selectedStudent) {
      fetchStudentInvoices();
    }
  }, [selectedStudent, invoiceId]);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!isNotEmpty(formData.studentId as string)) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!isPositiveNumber(formData.amount!.toString())) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.method) {
      newErrors.method = 'Payment method is required';
    }
    
    if (!isNotEmpty(formData.paymentDate as string)) {
      newErrors.paymentDate = 'Payment date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    
    // Update selected student when studentId changes
    if (name === 'studentId') {
      const student = students.find(s => s.id === value) || null;
      setSelectedStudent(student);
      
      // Clear selected invoice when student changes
      setSelectedInvoice(null);
      setFormData(prev => ({
        ...prev,
        invoiceId: '',
      }));
    }
    
    // Update selected invoice when invoiceId changes
    if (name === 'invoiceId') {
      const invoice = studentInvoices.find(inv => inv.id === value) || null;
      setSelectedInvoice(invoice);
      
      // If invoice is selected, set the amount to the balance
      if (invoice) {
        setFormData(prev => ({
          ...prev,
          amount: invoice.balance,
        }));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && payment) {
        // Update existing payment
        await paymentApi.updatePayment(payment.id, formData as UpdatePaymentDto);
        router.push(`/finance/payments/${payment.id}`);
      } else {
        // Create new payment
        const newPayment = await paymentApi.createPayment(formData as CreatePaymentDto);
        router.push(`/finance/payments/${newPayment.id}`);
      }
    } catch (err) {
      console.error('Error saving payment:', err);
      setErrors({
        general: 'Failed to save payment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errors.general}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Payment' : 'Record New Payment'}</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.studentId ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                disabled={isEditing || !!studentId}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.grade})
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">
                Invoice (Optional)
              </label>
              <select
                id="invoiceId"
                name="invoiceId"
                value={formData.invoiceId || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.invoiceId ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                disabled={isEditing || isLoadingInvoices || !selectedStudent || !!invoiceId}
              >
                <option value="">Select Invoice (Optional)</option>
                {studentInvoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber} - {formatCurrency(invoice.balance)} due on {formatDate(invoice.dueDate)}
                  </option>
                ))}
              </select>
              {isLoadingInvoices && (
                <p className="mt-1 text-sm text-gray-500">Loading invoices...</p>
              )}
              {errors.invoiceId && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceId}</p>
              )}
            </div>
          </div>
          
          {selectedInvoice && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Invoice Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-700">Invoice Number</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Issue Date</p>
                  <p className="font-medium">{formatDate(selectedInvoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Due Date</p>
                  <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Balance Due</p>
                  <p className="font-medium text-red-600">{formatCurrency(selectedInvoice.balance)}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={handleChange}
                  className={`block w-full pl-7 pr-12 py-2 border ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="0.00"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                id="method"
                name="method"
                value={formData.method || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.method ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                required
              >
                <option value="">Select Payment Method</option>
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>
                    {method.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.method && (
                <p className="mt-1 text-sm text-red-600">{errors.method}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={formData.paymentDate || ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.paymentDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.paymentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                Transaction ID / Reference
              </label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Transaction reference number (optional)"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Additional notes about this payment (optional)"
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCardIcon className="h-4 w-4 mr-1" />
            {isLoading ? 'Processing...' : isEditing ? 'Update Payment' : 'Record Payment'}
          </button>
        </div>
      </div>
    </form>
  );
}

