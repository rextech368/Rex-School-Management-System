'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  CreditCardIcon, 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { financeSummaryApi } from '@/lib/api/finance-api';
import { FinancialSummary } from '@/types/finance';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function FinanceDashboardPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // In a real application, this would be an API call
        // const data = await financeSummaryApi.getFinancialSummary();
        
        // Using mock data for now
        const mockSummary: FinancialSummary = {
          totalInvoiced: 250000,
          totalPaid: 180000,
          totalOutstanding: 70000,
          totalOverdue: 25000,
          recentPayments: [
            {
              id: '1',
              paymentNumber: 'PAY-001',
              student: {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                grade: 'Grade 10',
                studentId: 'ST001',
              },
              amount: 1500,
              method: 'BANK_TRANSFER',
              status: 'COMPLETED',
              paymentDate: '2023-11-15T00:00:00Z',
              receiptNumber: 'R001',
              createdAt: '2023-11-15T00:00:00Z',
              updatedAt: '2023-11-15T00:00:00Z',
            },
            {
              id: '2',
              paymentNumber: 'PAY-002',
              student: {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                grade: 'Grade 9',
                studentId: 'ST002',
              },
              amount: 1200,
              method: 'CASH',
              status: 'COMPLETED',
              paymentDate: '2023-11-14T00:00:00Z',
              receiptNumber: 'R002',
              createdAt: '2023-11-14T00:00:00Z',
              updatedAt: '2023-11-14T00:00:00Z',
            },
          ],
          pendingInvoices: [
            {
              id: '1',
              invoiceNumber: 'INV-001',
              student: {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                grade: 'Grade 10',
                studentId: 'ST001',
              },
              type: 'TUITION',
              status: 'PENDING',
              amount: 1500,
              balance: 1500,
              dueDate: '2023-12-15T00:00:00Z',
              issueDate: '2023-11-15T00:00:00Z',
              items: [],
              payments: [],
              createdAt: '2023-11-15T00:00:00Z',
              updatedAt: '2023-11-15T00:00:00Z',
            },
            {
              id: '2',
              invoiceNumber: 'INV-002',
              student: {
                id: '3',
                firstName: 'Michael',
                lastName: 'Johnson',
                grade: 'Grade 11',
                studentId: 'ST003',
              },
              type: 'TUITION',
              status: 'OVERDUE',
              amount: 1500,
              balance: 1500,
              dueDate: '2023-11-10T00:00:00Z',
              issueDate: '2023-10-15T00:00:00Z',
              items: [],
              payments: [],
              createdAt: '2023-10-15T00:00:00Z',
              updatedAt: '2023-10-15T00:00:00Z',
            },
          ],
        };
        
        setSummary(mockSummary);
      } catch (err) {
        console.error('Error fetching financial summary:', err);
        setError('Failed to load financial summary. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummary();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !summary) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || 'Failed to load data'}</span>
        </div>
      </div>
    );
  }
  
  const collectionRate = (summary.totalPaid / summary.totalInvoiced) * 100;
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600">Overview of financial activities</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link
            href="/finance/reports"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Report
          </Link>
          <Link
            href="/finance/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            New Invoice
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Invoiced</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalInvoiced)}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalPaid)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">
              <ArrowUpIcon className="inline h-4 w-4 mr-1" />
              {collectionRate.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">collection rate</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalOutstanding)}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Amount</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(summary.totalOverdue)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">
              <ArrowUpIcon className="inline h-4 w-4 mr-1" />
              {((summary.totalOverdue / summary.totalOutstanding) * 100).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">of outstanding</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <Link href="/finance/payments" className="text-blue-600 text-sm hover:text-blue-800">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/finance/payments/${payment.id}`}>
                        {payment.paymentNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.student.firstName} {payment.student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pending Invoices</h2>
            <Link href="/finance/invoices" className="text-blue-600 text-sm hover:text-blue-800">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.pendingInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/finance/invoices/${invoice.id}`}>
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.student.firstName} {invoice.student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/finance/invoices/new"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center justify-center"
          >
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Create Invoice</span>
          </Link>
          
          <Link
            href="/finance/payments/new"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center"
          >
            <CreditCardIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium">Record Payment</span>
          </Link>
          
          <Link
            href="/finance/fees/new"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center justify-center"
          >
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Create Fee</span>
          </Link>
          
          <Link
            href="/finance/reports"
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center justify-center"
          >
            <ChartBarIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium">Generate Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

