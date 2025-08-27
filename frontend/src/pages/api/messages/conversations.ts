import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getConversations(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get conversations for the current user
async function getConversations(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      isStarred,
      isArchived,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (isStarred) params.append('isStarred', isStarred as string);
    if (isArchived) params.append('isArchived', isArchived as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/conversations${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

