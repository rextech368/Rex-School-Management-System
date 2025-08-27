'use client';

import React, { useEffect, useState } from 'react';
import InvoiceList from '@/components/finance/invoices/invoice-list';
import { invoiceApi } from '@/lib/api/finance-api';
import { Invoice } from '@/types/finance';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceApi.getInvoices();
        setInvoices(response.data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage student invoices and payments</p>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <InvoiceList initialInvoices={isLoading ? undefined : invoices} />
      )}
    </div>
  );
}

