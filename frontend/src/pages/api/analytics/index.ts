import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAnalytics(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get analytics data with optional filtering
async function getAnalytics(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      type, 
      startDate,
      endDate,
      gradeLevel,
      classId,
      teacherId,
      studentId
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (type) params.append('type', type as string);
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);
    if (gradeLevel) params.append('gradeLevel', gradeLevel as string);
    if (classId) params.append('classId', classId as string);
    if (teacherId) params.append('teacherId', teacherId as string);
    if (studentId) params.append('studentId', studentId as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/analytics${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

