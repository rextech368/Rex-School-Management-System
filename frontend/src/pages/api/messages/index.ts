import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getMessages(req, res, session);
    case 'POST':
      return sendMessage(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get messages with optional filtering
async function getMessages(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      conversationId, 
      recipientId,
      isRead,
      isStarred,
      isArchived,
      limit,
      offset
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (conversationId) params.append('conversationId', conversationId as string);
    if (recipientId) params.append('recipientId', recipientId as string);
    if (isRead) params.append('isRead', isRead as string);
    if (isStarred) params.append('isStarred', isStarred as string);
    if (isArchived) params.append('isArchived', isArchived as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Send a new message
async function sendMessage(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      recipientId,
      subject,
      content,
      conversationId
    } = req.body;

    // Validate required fields
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient ID and content are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        recipientId,
        subject,
        content,
        conversationId,
        senderId: session.user.id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

