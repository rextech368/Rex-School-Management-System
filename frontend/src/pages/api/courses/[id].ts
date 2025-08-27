import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  switch (req.method) {
    case 'GET':
      return getCourse(req, res, id);
    case 'PUT':
      return updateCourse(req, res, id);
    case 'DELETE':
      return deleteCourse(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific course by ID
async function getCourse(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Course not found' });
      }
      throw new Error('Failed to fetch course');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a course
async function updateCourse(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const session = await getSession({ req });
    
    // Check if user has permission to update courses
    if (!['admin', 'registrar'].includes(session.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a course
async function deleteCourse(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const session = await getSession({ req });
    
    // Check if user has permission to delete courses
    if (!['admin'].includes(session.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

