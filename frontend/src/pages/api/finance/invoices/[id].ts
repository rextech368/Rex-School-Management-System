import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { InvoiceStatus } from '@/lib/types/finance';

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

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' });
  }

  switch (req.method) {
    case 'GET':
      return getInvoice(req, res, session, id);
    case 'PUT':
      return updateInvoice(req, res, session, id);
    case 'DELETE':
      return deleteInvoice(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific invoice by ID
async function getInvoice(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      throw new Error('Failed to fetch invoice');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an existing invoice
async function updateInvoice(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    const { 
      studentId,
      studentName,
      issueDate,
      dueDate,
      items,
      discounts,
      tax,
      status,
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

    // Get current invoice to calculate amount due
    const currentInvoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!currentInvoiceResponse.ok) {
      if (currentInvoiceResponse.status === 404) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      throw new Error('Failed to fetch current invoice');
    }

    const currentInvoice = await currentInvoiceResponse.json();
    const amountPaid = currentInvoice.amountPaid || 0;
    const amountDue = total - amountPaid;

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        studentId,
        studentName,
        issueDate,
        dueDate,
        items,
        subtotal,
        discounts: discounts || [],
        tax: tax || 0,
        total,
        amountPaid,
        amountDue,
        status: status || currentInvoice.status,
        notes,
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an invoice
async function deleteInvoice(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete invoices
    const canDelete = ['admin', 'finance_admin'].includes(session.user.role);
    if (!canDelete) {
      return res.status(403).json({ message: 'You do not have permission to delete invoices' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      throw new Error('Failed to delete invoice');
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

