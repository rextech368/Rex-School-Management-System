import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAttendanceRecords(req, res, session);
    case 'POST':
      return recordAttendance(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get attendance records with optional filtering
async function getAttendanceRecords(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      classId, 
      studentId, 
      date,
      startDate,
      endDate
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId as string);
    if (studentId) params.append('studentId', studentId as string);
    if (date) params.append('date', date as string);
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance records');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Record attendance for a class
async function recordAttendance(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to record attendance
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      classId, 
      date,
      records
    } = req.body;

    // Validate required fields
    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Class ID, date, and attendance records are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        classId,
        date,
        records,
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
    console.error('Error recording attendance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

