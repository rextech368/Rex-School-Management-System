import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Students Card */}
        <Link href="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Students</h2>
              <p className="text-gray-500">Manage student records</p>
            </div>
            <div className="text-blue-500 text-4xl">🧑‍🎓</div>
          </div>
        </Link>
        
        {/* Classes Card */}
        <Link href="/classes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Classes</h2>
              <p className="text-gray-500">Manage classes and courses</p>
            </div>
            <div className="text-green-500 text-4xl">📚</div>
          </div>
        </Link>
        
        {/* Finance Card */}
        <Link href="/finance" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Finance</h2>
              <p className="text-gray-500">Manage fees and payments</p>
            </div>
            <div className="text-yellow-500 text-4xl">💰</div>
          </div>
        </Link>
        
        {/* Attendance Card */}
        <Link href="/attendance" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Attendance</h2>
              <p className="text-gray-500">Track student attendance</p>
            </div>
            <div className="text-purple-500 text-4xl">📋</div>
          </div>
        </Link>
        
        {/* Reports Card */}
        <Link href="/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Reports</h2>
              <p className="text-gray-500">Generate and view reports</p>
            </div>
            <div className="text-red-500 text-4xl">📊</div>
          </div>
        </Link>
        
        {/* Settings Card */}
        <Link href="/settings" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Settings</h2>
              <p className="text-gray-500">Configure system settings</p>
            </div>
            <div className="text-gray-500 text-4xl">⚙️</div>
          </div>
        </Link>
      </div>
      
      {/* Quick Actions Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/students/add" className="bg-blue-50 p-3 rounded-md text-center hover:bg-blue-100 transition-colors">
            <div className="text-2xl mb-1">➕</div>
            <div className="text-sm">Add Student</div>
          </Link>
          <Link href="/finance/invoices/create" className="bg-green-50 p-3 rounded-md text-center hover:bg-green-100 transition-colors">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-sm">Create Invoice</div>
          </Link>
          <Link href="/attendance/record" className="bg-purple-50 p-3 rounded-md text-center hover:bg-purple-100 transition-colors">
            <div className="text-2xl mb-1">✓</div>
            <div className="text-sm">Record Attendance</div>
          </Link>
          <Link href="/reports/generate" className="bg-yellow-50 p-3 rounded-md text-center hover:bg-yellow-100 transition-colors">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm">Generate Report</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

