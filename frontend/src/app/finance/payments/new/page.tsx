'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PaymentForm from '@/components/finance/payments/payment-form';
import { Student } from '@/types/finance';

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

export default function NewPaymentPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const studentId = searchParams.get('studentId');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        // const studentsResponse = await studentApi.getStudents();
        
        // Using mock data for now
        setStudents(mockStudents);
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
        <h1 className="text-2xl font-bold text-gray-900">Record New Payment</h1>
        <p className="text-gray-600">Record a new payment for a student</p>
      </div>
      
      <PaymentForm 
        students={students} 
        invoiceId={invoiceId || undefined} 
        studentId={studentId || undefined} 
      />
    </div>
  );
}

