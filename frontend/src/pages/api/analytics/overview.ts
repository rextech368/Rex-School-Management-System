import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getOverviewAnalytics(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get overview analytics data
async function getOverviewAnalytics(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      startDate,
      endDate,
      termId
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate as string);
    if (endDate) params.append('endDate', endDate as string);
    if (termId) params.append('termId', termId as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/analytics/overview${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch overview analytics');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

