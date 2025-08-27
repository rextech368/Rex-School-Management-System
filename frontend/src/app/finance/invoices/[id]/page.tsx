'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InvoiceDetail from '@/components/finance/invoices/invoice-detail';
import { invoiceApi } from '@/lib/api/finance-api';
import { Invoice } from '@/types/finance';

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await invoiceApi.getInvoice(invoiceId);
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('Failed to load invoice. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoice();
  }, [invoiceId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !invoice) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || 'Invoice not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
        <p className="text-gray-600">View and manage invoice details</p>
      </div>
      
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}

