'use client';

import React from 'react';
import FeeForm from '@/components/finance/fees/fee-form';

// This would be replaced with actual API calls
const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export default function NewFeePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Fee</h1>
        <p className="text-gray-600">Define a new fee structure</p>
      </div>
      
      <FeeForm academicYears={academicYears} gradeLevels={gradeLevels} />
    </div>
  );
}

