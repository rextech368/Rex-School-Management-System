import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getGradeRecords(req, res, session);
    case 'POST':
      return recordGrades(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get grade records with optional filtering
async function getGradeRecords(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      classId, 
      studentId, 
      assignmentId,
      termId
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId as string);
    if (studentId) params.append('studentId', studentId as string);
    if (assignmentId) params.append('assignmentId', assignmentId as string);
    if (termId) params.append('termId', termId as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/grades${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch grade records');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching grade records:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Record grades for an assignment
async function recordGrades(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to record grades
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      classId, 
      assignmentId,
      grades
    } = req.body;

    // Validate required fields
    if (!classId || !assignmentId || !grades || !Array.isArray(grades)) {
      return res.status(400).json({ message: 'Class ID, assignment ID, and grades are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/grades`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        classId,
        assignmentId,
        grades,
        recordedBy: session.user.id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error recording grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

