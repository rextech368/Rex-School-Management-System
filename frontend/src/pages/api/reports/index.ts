import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Report, ReportType } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getReports(req, res, session);
    case 'POST':
      return createReport(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get reports with optional filtering
async function getReports(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      type, 
      createdBy,
      isPublic,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (type) params.append('type', type as string);
    if (createdBy) params.append('createdBy', createdBy as string);
    if (isPublic) params.append('isPublic', isPublic as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new report
async function createReport(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      title,
      description,
      type,
      parameters,
      isPublic,
      accessRoles
    } = req.body;

    // Validate required fields
    if (!title || !type || !parameters) {
      return res.status(400).json({ message: 'Title, type, and parameters are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        type,
        parameters,
        isPublic: isPublic || false,
        accessRoles: accessRoles || [],
        createdBy: session.user.id,
        createdAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

