'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PencilIcon, 
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { Invoice, InvoiceStatus, Payment } from '@/types/finance';
import { invoiceApi } from '@/lib/api/finance-api';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface InvoiceDetailProps {
  invoice: Invoice;
}

export default function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(invoice);
  
  const handleStatusChange = async (status: InvoiceStatus) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedInvoice = await invoiceApi.updateInvoice(invoice.id, { status });
      setCurrentInvoice(updatedInvoice);
    } catch (err) {
      console.error('Error updating invoice status:', err);
      setError('Failed to update invoice status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadgeClass = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.PARTIALLY_PAID:
        return 'bg-yellow-100 text-yellow-800';
      case InvoiceStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      case InvoiceStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case InvoiceStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 line-through';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Invoice #{currentInvoice.invoiceNumber}</h2>
            <p className="text-sm text-gray-500">
              Created on {formatDate(currentInvoice.createdAt)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push(`/finance/invoices/${currentInvoice.id}/edit`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            
            <button
              onClick={() => window.open(`/api/invoices/${currentInvoice.id}/pdf`, '_blank')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Download
            </button>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PrinterIcon className="h-4 w-4 mr-1" />
              Print
            </button>
            
            <button
              onClick={() => router.push(`/finance/payments/new?invoiceId=${currentInvoice.id}`)}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CreditCardIcon className="h-4 w-4 mr-1" />
              Record Payment
            </button>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice Details</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Invoice Number</p>
                  <p className="font-medium">{currentInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(currentInvoice.status)}`}>
                    {currentInvoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Issue Date</p>
                  <p className="font-medium">{formatDate(currentInvoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium">{formatDate(currentInvoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium">{currentInvoice.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="font-medium">{currentInvoice.description || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Student Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">
                    <Link href={`/students/${currentInvoice.student.id}`} className="text-blue-600 hover:text-blue-800">
                      {currentInvoice.student.firstName} {currentInvoice.student.lastName}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Student ID</p>
                  <p className="font-medium">{currentInvoice.student.studentId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Grade</p>
                  <p className="font-medium">{currentInvoice.student.grade}</p>
                </div>
                <div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/students/${currentInvoice.student.id}/finance`)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Financial History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Invoice Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Subtotal:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(currentInvoice.amount)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Amount Paid:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(currentInvoice.amount - currentInvoice.balance)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    Balance Due:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                    {formatCurrency(currentInvoice.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Payment History</h3>
          {currentInvoice.payments.length === 0 ? (
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInvoice.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link href={`/finance/payments/${payment.id}`}>
                          {payment.paymentNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/finance/payments/${payment.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
          <div className="mr-2 text-sm font-medium text-gray-700">Change Status:</div>
          {Object.values(InvoiceStatus).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isLoading || currentInvoice.status === status}
              className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded-full ${
                currentInvoice.status === status
                  ? 'bg-gray-200 text-gray-800 border-gray-300 cursor-default'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

