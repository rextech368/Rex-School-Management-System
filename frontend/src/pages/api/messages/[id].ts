import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid message ID' });
  }

  switch (req.method) {
    case 'GET':
      return getMessage(req, res, session, id);
    case 'PUT':
      return updateMessage(req, res, session, id);
    case 'DELETE':
      return deleteMessage(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific message by ID
async function getMessage(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Message not found' });
      }
      throw new Error('Failed to fetch message');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching message ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a message (mark as read, star, archive)
async function updateMessage(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    const { 
      isRead,
      isStarred,
      isArchived
    } = req.body;

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        isRead,
        isStarred,
        isArchived
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Message not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a message
async function deleteMessage(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

