import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { TermType } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getTerms(req, res, session);
    case 'POST':
      return createTerm(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all terms with optional filtering
async function getTerms(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      active, 
      current, 
      type, 
      academicYear,
      upcoming,
      ongoing,
      past
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (active !== undefined) params.append('active', active as string);
    if (current !== undefined) params.append('current', current as string);
    if (type) params.append('type', type as string);
    if (academicYear) params.append('academicYear', academicYear as string);
    if (upcoming !== undefined) params.append('upcoming', upcoming as string);
    if (ongoing !== undefined) params.append('ongoing', ongoing as string);
    if (past !== undefined) params.append('past', past as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch terms');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching terms:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new term
async function createTerm(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to create terms
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      name, 
      code, 
      type = TermType.SEMESTER, 
      startDate, 
      endDate, 
      registrationStart, 
      registrationEnd, 
      isActive = true, 
      isCurrent = false, 
      description, 
      academicYear 
    } = req.body;

    // Validate required fields
    if (!name || !code || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, code, start date, and end date are required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (registrationStart && registrationEnd) {
      const regStart = new Date(registrationStart);
      const regEnd = new Date(registrationEnd);
      
      if (regEnd <= regStart) {
        return res.status(400).json({ message: 'Registration end date must be after registration start date' });
      }
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        name,
        code,
        type,
        startDate,
        endDate,
        registrationStart,
        registrationEnd,
        isActive,
        isCurrent,
        description,
        academicYear
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating term:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

