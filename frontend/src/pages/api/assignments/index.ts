import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAssignments(req, res, session);
    case 'POST':
      return createAssignment(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get assignments with optional filtering
async function getAssignments(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      classId, 
      termId,
      status
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId as string);
    if (termId) params.append('termId', termId as string);
    if (status) params.append('status', status as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assignments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new assignment
async function createAssignment(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to create assignments
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      classId, 
      title,
      description,
      type,
      dueDate,
      maxScore,
      weight,
      status
    } = req.body;

    // Validate required fields
    if (!classId || !title || !type || !dueDate || maxScore === undefined || weight === undefined) {
      return res.status(400).json({ message: 'Class ID, title, type, due date, max score, and weight are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assignments`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        classId,
        title,
        description,
        type,
        dueDate,
        maxScore,
        weight,
        status: status || 'draft',
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
    console.error('Error creating assignment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

