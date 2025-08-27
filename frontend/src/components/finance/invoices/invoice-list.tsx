'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Invoice, InvoiceStatus, InvoiceFilters } from '@/types/finance';
import { invoiceApi } from '@/lib/api/finance-api';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface InvoiceListProps {
  initialInvoices?: Invoice[];
  studentId?: string;
}

export default function InvoiceList({ initialInvoices, studentId }: InvoiceListProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices || []);
  const [isLoading, setIsLoading] = useState(!initialInvoices);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<InvoiceFilters>(studentId ? { studentId } : {});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await invoiceApi.getInvoices(filters, currentPage, 10);
      setInvoices(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!initialInvoices) {
      fetchInvoices();
    }
  }, [initialInvoices, currentPage, filters]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    // This could search by invoice number or student name
  };
  
  const handleViewInvoice = (id: string) => {
    router.push(`/finance/invoices/${id}`);
  };
  
  const handleEditInvoice = (id: string) => {
    router.push(`/finance/invoices/${id}/edit`);
  };
  
  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceApi.deleteInvoice(id);
        setInvoices(invoices.filter(invoice => invoice.id !== id));
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice. Please try again.');
      }
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
  
  if (isLoading && !invoices.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && !invoices.length) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-lg font-semibold">Invoices</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 rounded-r-md border border-l-0 border-gray-300"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </button>
          
          <button
            onClick={() => router.push('/finance/invoices/new')}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            New Invoice
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              {Object.values(InvoiceStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters(studentId ? { studentId } : {})}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
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
                Issue Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
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
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.student.firstName} {invoice.student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditInvoice(invoice.id)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')}
                      className="text-gray-600 hover:text-gray-900"
                      title="Download PDF"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, invoices.length)}</span> of{' '}
                <span className="font-medium">{invoices.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

