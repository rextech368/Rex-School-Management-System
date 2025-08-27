'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  Invoice, 
  InvoiceType, 
  CreateInvoiceDto, 
  UpdateInvoiceDto,
  Student,
  Fee
} from '@/types/finance';
import { invoiceApi } from '@/lib/api/finance-api';
import { formatCurrency } from '@/lib/utils/format';
import { isNotEmpty, isPositiveNumber } from '@/lib/utils/validation';

interface InvoiceFormProps {
  invoice?: Invoice;
  students: Student[];
  fees: Fee[];
}

interface InvoiceItemForm {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  feeId?: string;
}

interface FormErrors {
  studentId?: string;
  type?: string;
  dueDate?: string;
  items?: string;
  general?: string;
}

export default function InvoiceForm({ invoice, students, fees }: InvoiceFormProps) {
  const router = useRouter();
  const isEditing = !!invoice;
  
  const [formData, setFormData] = useState<CreateInvoiceDto | UpdateInvoiceDto>({
    studentId: invoice?.student.id || '',
    type: invoice?.type || InvoiceType.TUITION,
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
    description: invoice?.description || '',
    items: invoice?.items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      feeId: item.feeId,
    })) || [],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    invoice ? invoice.student : null
  );
  const [items, setItems] = useState<InvoiceItemForm[]>(
    invoice?.items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
      feeId: item.feeId,
    })) || []
  );
  const [totalAmount, setTotalAmount] = useState(invoice?.amount || 0);
  
  useEffect(() => {
    // Calculate total amount whenever items change
    const newTotal = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(newTotal);
  }, [items]);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!isNotEmpty(formData.studentId as string)) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Invoice type is required';
    }
    
    if (!isNotEmpty(formData.dueDate as string)) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
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
    }
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItemForm, value: string | number) => {
    const updatedItems = [...items];
    
    // Update the specified field
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    // If quantity or unitPrice changed, recalculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : updatedItems[index].unitPrice;
      updatedItems[index].amount = quantity * unitPrice;
    }
    
    // If feeId changed, update description, unitPrice, and amount
    if (field === 'feeId' && value) {
      const selectedFee = fees.find(fee => fee.id === value);
      if (selectedFee) {
        updatedItems[index].description = selectedFee.name;
        updatedItems[index].unitPrice = selectedFee.amount;
        updatedItems[index].amount = updatedItems[index].quantity * selectedFee.amount;
      }
    }
    
    setItems(updatedItems);
    
    // Update formData with the new items
    setFormData({
      ...formData,
      items: updatedItems.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        feeId: item.feeId,
      })),
    });
    
    // Clear items error if it exists
    if (errors.items) {
      setErrors({
        ...errors,
        items: undefined,
      });
    }
  };
  
  const handleAddItem = () => {
    const newItem: InvoiceItemForm = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    
    setItems([...items, newItem]);
    
    // Update formData with the new item
    setFormData({
      ...formData,
      items: [
        ...(formData.items || []),
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
    
    // Clear items error if it exists
    if (errors.items) {
      setErrors({
        ...errors,
        items: undefined,
      });
    }
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    
    // Update formData with the updated items
    setFormData({
      ...formData,
      items: updatedItems.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        feeId: item.feeId,
      })),
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && invoice) {
        // Update existing invoice
        await invoiceApi.updateInvoice(invoice.id, formData as UpdateInvoiceDto);
        router.push(`/finance/invoices/${invoice.id}`);
      } else {
        // Create new invoice
        const newInvoice = await invoiceApi.createInvoice(formData as CreateInvoiceDto);
        router.push(`/finance/invoices/${newInvoice.id}`);
      }
    } catch (err) {
      console.error('Error saving invoice:', err);
      setErrors({
        general: 'Failed to save invoice. Please try again.',
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
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h2>
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
                disabled={isEditing}
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Invoice Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
              >
                <option value="">Select Type</option>
                {Object.values(InvoiceType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Invoice description (optional)"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            {errors.items && (
              <p className="mt-1 text-sm text-red-600 mb-2">{errors.items}</p>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No items added yet
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={item.feeId || ''}
                            onChange={(e) => handleItemChange(index, 'feeId', e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select Fee (Optional)</option>
                            {fees.map((fee) => (
                              <option key={fee.id} value={fee.id}>
                                {fee.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Item description"
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(totalAmount)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </form>
  );
}

