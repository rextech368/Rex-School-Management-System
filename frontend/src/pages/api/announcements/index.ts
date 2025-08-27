import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAnnouncements(req, res, session);
    case 'POST':
      return createAnnouncement(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get announcements with optional filtering
async function getAnnouncements(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      targetAudience, 
      isPinned,
      authorId,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (targetAudience) params.append('targetAudience', targetAudience as string);
    if (isPinned) params.append('isPinned', isPinned as string);
    if (authorId) params.append('authorId', authorId as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch announcements');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new announcement
async function createAnnouncement(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to create announcements
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      title,
      content,
      targetAudience,
      targetIds,
      isPinned,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!title || !content || !targetAudience) {
      return res.status(400).json({ message: 'Title, content, and target audience are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        title,
        content,
        targetAudience,
        targetIds,
        isPinned: isPinned || false,
        expiresAt,
        authorId: session.user.id,
        authorName: session.user.name,
        authorRole: session.user.role
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

