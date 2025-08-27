import React from 'react';
import Link from 'next/link';

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <div className="flex space-x-2">
          <Link
            href="/finance/invoices/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Invoice
          </Link>
          <Link
            href="/finance/payments/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Record Payment
          </Link>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">$125,750.00</p>
          <p className="text-sm text-gray-500 mt-1">Current Academic Year</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Outstanding Balance</h2>
          <p className="text-3xl font-bold text-red-600">$42,350.00</p>
          <p className="text-sm text-gray-500 mt-1">Across All Invoices</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Recent Payments</h2>
          <p className="text-3xl font-bold text-blue-600">$15,200.00</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 Days</p>
        </div>
      </div>

      {/* Finance Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Invoices Card */}
        <Link href="/finance/invoices" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Invoices</h2>
              <p className="text-gray-500">Manage student invoices</p>
            </div>
            <div className="text-blue-500 text-4xl">📄</div>
          </div>
        </Link>
        
        {/* Payments Card */}
        <Link href="/finance/payments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Payments</h2>
              <p className="text-gray-500">Track and record payments</p>
            </div>
            <div className="text-green-500 text-4xl">💵</div>
          </div>
        </Link>
        
        {/* Fee Structure Card */}
        <Link href="/finance/fees" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Fee Structure</h2>
              <p className="text-gray-500">Configure fee structures</p>
            </div>
            <div className="text-purple-500 text-4xl">📊</div>
          </div>
        </Link>
        
        {/* Reports Card */}
        <Link href="/finance/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Financial Reports</h2>
              <p className="text-gray-500">Generate financial reports</p>
            </div>
            <div className="text-yellow-500 text-4xl">📈</div>
          </div>
        </Link>
        
        {/* Scholarships Card */}
        <Link href="/finance/scholarships" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Scholarships</h2>
              <p className="text-gray-500">Manage student scholarships</p>
            </div>
            <div className="text-red-500 text-4xl">🎓</div>
          </div>
        </Link>
        
        {/* Settings Card */}
        <Link href="/finance/settings" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Finance Settings</h2>
              <p className="text-gray-500">Configure finance settings</p>
            </div>
            <div className="text-gray-500 text-4xl">⚙️</div>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-08-25</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$1,200.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-08-24</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sarah Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Invoice</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">$2,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-08-23</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Michael Brown</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$850.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-08-22</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Emily Davis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Invoice</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">$1,750.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-08-21</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">David Wilson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$1,000.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link href="/finance/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Transactions →
          </Link>
        </div>
      </div>
    </div>
  );
}

