import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid attendance record ID' });
  }

  switch (req.method) {
    case 'GET':
      return getAttendanceRecord(req, res, session, id);
    case 'PUT':
      return updateAttendanceRecord(req, res, session, id);
    case 'DELETE':
      return deleteAttendanceRecord(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific attendance record by ID
async function getAttendanceRecord(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      throw new Error('Failed to fetch attendance record');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching attendance record ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an attendance record
async function updateAttendanceRecord(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update attendance records
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      status,
      notes
    } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        status,
        notes,
        updatedBy: session.user.id
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating attendance record ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an attendance record
async function deleteAttendanceRecord(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete attendance records
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting attendance record ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

