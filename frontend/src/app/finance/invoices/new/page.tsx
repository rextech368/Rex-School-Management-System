'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceForm from '@/components/finance/invoices/invoice-form';
import { Student, Fee } from '@/types/finance';

// This would be replaced with actual API calls
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    grade: 'Grade 10',
    studentId: 'ST001',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    grade: 'Grade 9',
    studentId: 'ST002',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    grade: 'Grade 11',
    studentId: 'ST003',
  },
];

const mockFees: Fee[] = [
  {
    id: '1',
    name: 'Tuition Fee',
    type: 'TUITION',
    amount: 1500,
    frequency: 'TERM',
    academicYear: '2023-2024',
    isRequired: true,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Registration Fee',
    type: 'REGISTRATION',
    amount: 200,
    frequency: 'ANNUAL',
    academicYear: '2023-2024',
    isRequired: true,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Exam Fee',
    type: 'EXAM',
    amount: 100,
    frequency: 'TERM',
    academicYear: '2023-2024',
    isRequired: true,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, these would be API calls
        // const studentsResponse = await studentApi.getStudents();
        // const feesResponse = await feeApi.getFees();
        
        // Using mock data for now
        setStudents(mockStudents);
        setFees(mockFees);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="text-gray-600">Create a new invoice for a student</p>
      </div>
      
      <InvoiceForm students={students} fees={fees} />
    </div>
  );
}

