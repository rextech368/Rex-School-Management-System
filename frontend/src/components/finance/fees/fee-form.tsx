'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  Fee, 
  FeeType, 
  FeeFrequency, 
  CreateFeeDto, 
  UpdateFeeDto 
} from '@/types/finance';
import { feeApi } from '@/lib/api/finance-api';
import { isNotEmpty, isPositiveNumber } from '@/lib/utils/validation';

interface FeeFormProps {
  fee?: Fee;
  academicYears: string[];
  gradeLevels: string[];
}

interface FormErrors {
  name?: string;
  type?: string;
  amount?: string;
  frequency?: string;
  academicYear?: string;
  general?: string;
}

export default function FeeForm({ fee, academicYears, gradeLevels }: FeeFormProps) {
  const router = useRouter();
  const isEditing = !!fee;
  
  const [formData, setFormData] = useState<CreateFeeDto | UpdateFeeDto>({
    name: fee?.name || '',
    description: fee?.description || '',
    type: fee?.type || FeeType.TUITION,
    amount: fee?.amount || 0,
    frequency: fee?.frequency || FeeFrequency.TERM,
    academicYear: fee?.academicYear || academicYears[0] || '',
    gradeLevel: fee?.gradeLevel || '',
    isRequired: fee?.isRequired ?? true,
    isActive: fee?.isActive ?? true,
    startDate: fee?.startDate ? new Date(fee.startDate).toISOString().split('T')[0] : '',
    endDate: fee?.endDate ? new Date(fee.endDate).toISOString().split('T')[0] : '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!isNotEmpty(formData.name as string)) {
      newErrors.name = 'Fee name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Fee type is required';
    }
    
    if (!isPositiveNumber(formData.amount!.toString())) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    
    if (!isNotEmpty(formData.academicYear as string)) {
      newErrors.academicYear = 'Academic year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'amount' ? (value ? parseFloat(value) : 0) : value,
      });
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && fee) {
        // Update existing fee
        await feeApi.updateFee(fee.id, formData as UpdateFeeDto);
        router.push('/finance/fees');
      } else {
        // Create new fee
        await feeApi.createFee(formData as CreateFeeDto);
        router.push('/finance/fees');
      }
    } catch (err) {
      console.error('Error saving fee:', err);
      setErrors({
        general: 'Failed to save fee. Please try again.',
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
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Fee' : 'Create New Fee'}</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Fee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Fee Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                required
              >
                <option value="">Select Fee Type</option>
                {Object.values(FeeType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
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
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.frequency ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                required
              >
                <option value="">Select Frequency</option>
                {Object.values(FeeFrequency).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear || ''}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.academicYear ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.academicYear && (
                <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700">
                Grade Level (Optional)
              </label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Grades</option>
                {gradeLevels.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to apply to all grade levels
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date (Optional)
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
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
              placeholder="Fee description (optional)"
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <input
                id="isRequired"
                name="isRequired"
                type="checkbox"
                checked={formData.isRequired as boolean}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-700">
                This fee is required for all applicable students
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive as boolean}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                This fee is active and can be applied to invoices
              </label>
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Fee' : 'Create Fee'}
          </button>
        </div>
      </div>
    </form>
  );
}

