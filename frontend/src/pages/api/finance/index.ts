import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

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
      return getFinancialSummary(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get financial summary data
async function getFinancialSummary(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      startDate,
      endDate,
      academicYear
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);
    if (academicYear) params.append('academicYear', academicYear as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/finance/summary${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch financial summary');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

