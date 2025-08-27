import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid announcement ID' });
  }

  switch (req.method) {
    case 'GET':
      return getAnnouncement(req, res, session, id);
    case 'PUT':
      return updateAnnouncement(req, res, session, id);
    case 'DELETE':
      return deleteAnnouncement(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific announcement by ID
async function getAnnouncement(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      throw new Error('Failed to fetch announcement');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an announcement
async function updateAnnouncement(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update the announcement
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    const isTeacher = session.user.role === 'teacher';
    
    // For teachers, we'll need to check if they are the author
    if (!isAdmin && isTeacher) {
      // Get the announcement to check if the user is the author
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: 'Announcement not found' });
        }
        throw new Error('Failed to fetch announcement');
      }
      
      const announcement = await response.json();
      
      if (announcement.authorId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own announcements' });
      }
    } else if (!isAdmin && !isTeacher) {
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
    const updateUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        title,
        content,
        targetAudience,
        targetIds,
        isPinned,
        expiresAt,
        updatedBy: session.user.id
      }),
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 404) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      const errorData = await updateResponse.json();
      return res.status(updateResponse.status).json(errorData);
    }

    const data = await updateResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating announcement ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an announcement
async function deleteAnnouncement(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete the announcement
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    const isTeacher = session.user.role === 'teacher';
    
    // For teachers, we'll need to check if they are the author
    if (!isAdmin && isTeacher) {
      // Get the announcement to check if the user is the author
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: 'Announcement not found' });
        }
        throw new Error('Failed to fetch announcement');
      }
      
      const announcement = await response.json();
      
      if (announcement.authorId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own announcements' });
      }
    } else if (!isAdmin && !isTeacher) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!deleteResponse.ok) {
      if (deleteResponse.status === 404) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      const errorData = await deleteResponse.json();
      return res.status(deleteResponse.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting announcement ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

