import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAttendanceReports(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get attendance reports with optional filtering
async function getAttendanceReports(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      reportType,
      classId, 
      studentId, 
      startDate,
      endDate
    } = req.query;

    // Validate required fields
    if (!reportType) {
      return res.status(400).json({ message: 'Report type is required' });
    }

    // Validate report type
    if (!['class', 'student', 'summary'].includes(reportType as string)) {
      return res.status(400).json({ message: 'Invalid report type. Must be one of: class, student, summary' });
    }

    // Validate parameters based on report type
    if (reportType === 'class' && !classId) {
      return res.status(400).json({ message: 'Class ID is required for class reports' });
    }

    if (reportType === 'student' && !studentId) {
      return res.status(400).json({ message: 'Student ID is required for student reports' });
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('reportType', reportType as string);
    if (classId) params.append('classId', classId as string);
    if (studentId) params.append('studentId', studentId as string);
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/reports?${params.toString()}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance reports');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching attendance reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

