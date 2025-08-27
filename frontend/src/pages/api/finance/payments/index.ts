import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PaymentStatus } from '@/lib/types/finance';

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
      return getPayments(req, res, session);
    case 'POST':
      return createPayment(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get payments with optional filtering
async function getPayments(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      studentId, 
      invoiceId,
      paymentMethod,
      status,
      startDate,
      endDate,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId as string);
    if (invoiceId) params.append('invoiceId', invoiceId as string);
    if (paymentMethod) params.append('paymentMethod', paymentMethod as string);
    if (status) params.append('status', status as string);
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/payments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new payment
async function createPayment(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      studentId,
      studentName,
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      referenceNumber,
      notes
    } = req.body;

    // Validate required fields
    if (!studentId || !studentName || !amount || !paymentMethod || !paymentDate) {
      return res.status(400).json({ message: 'Student, amount, payment method, and payment date are required' });
    }

    // Generate receipt number
    const receiptNumber = `RCPT-${Date.now().toString().slice(-8)}`;

    // If invoice ID is provided, update the invoice
    if (invoiceId) {
      // Get current invoice
      const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (!invoiceResponse.ok) {
        if (invoiceResponse.status === 404) {
          return res.status(404).json({ message: 'Invoice not found' });
        }
        throw new Error('Failed to fetch invoice');
      }

      const invoice = await invoiceResponse.json();
      
      // Calculate new amounts
      const newAmountPaid = (invoice.amountPaid || 0) + amount;
      const newAmountDue = invoice.total - newAmountPaid;
      
      // Determine new status
      let newStatus = invoice.status;
      if (newAmountDue <= 0) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'partially_paid';
      }

      // Update invoice
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }),
      });
    }

    // Call backend API to create payment
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/payments`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        studentId,
        studentName,
        invoiceId,
        amount,
        currency: 'USD', // This should come from settings in a real app
        paymentMethod,
        paymentDate,
        status: PaymentStatus.COMPLETED,
        referenceNumber,
        notes,
        receiptNumber,
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
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

