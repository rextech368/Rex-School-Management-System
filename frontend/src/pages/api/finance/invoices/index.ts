import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Invoice, InvoiceStatus } from '@/lib/types/finance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user has permission to access finance module
  const isAuthorized = ['admin', 'finance_admin', 'finance_staff'].includes(session.user.role);
  if (!isAuthorized) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getInvoices(req, res, session);
    case 'POST':
      return createInvoice(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get invoices with optional filtering
async function getInvoices(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      studentId, 
      status,
      startDate,
      endDate,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId as string);
    if (status) params.append('status', status as string);
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/invoices${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new invoice
async function createInvoice(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      studentId,
      studentName,
      issueDate,
      dueDate,
      items,
      discounts,
      tax,
      notes
    } = req.body;

    // Validate required fields
    if (!studentId || !studentName || !issueDate || !dueDate || !items || !items.length) {
      return res.status(400).json({ message: 'Student, issue date, due date, and at least one item are required' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const discountTotal = discounts ? discounts.reduce((sum: number, discount: any) => sum + discount.amount, 0) : 0;
    const taxAmount = tax ? subtotal * (tax / 100) : 0;
    const total = subtotal - discountTotal + taxAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/invoices`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        studentId,
        studentName,
        invoiceNumber,
        issueDate,
        dueDate,
        items,
        subtotal,
        discounts: discounts || [],
        tax: tax || 0,
        total,
        amountPaid: 0,
        amountDue: total,
        currency: 'USD', // This should come from settings in a real app
        status: InvoiceStatus.DRAFT,
        notes,
        createdAt: new Date().toISOString(),
        createdBy: session.user.id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

