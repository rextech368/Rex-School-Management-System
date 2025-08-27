import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  switch (req.method) {
    case 'GET':
      return getAssignment(req, res, session, id);
    case 'PUT':
      return updateAssignment(req, res, session, id);
    case 'DELETE':
      return deleteAssignment(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific assignment by ID
async function getAssignment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      throw new Error('Failed to fetch assignment');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching assignment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an assignment
async function updateAssignment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update assignments
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      title,
      description,
      type,
      dueDate,
      maxScore,
      weight,
      status
    } = req.body;

    // Validate required fields
    if (!title || !type || !dueDate || maxScore === undefined || weight === undefined) {
      return res.status(400).json({ message: 'Title, type, due date, max score, and weight are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        type,
        dueDate,
        maxScore,
        weight,
        status,
        updatedBy: session.user.id
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating assignment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an assignment
async function deleteAssignment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete assignments
    const isAuthorized = ['admin', 'teacher', 'registrar'].includes(session.user.role);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      
      // Handle case where assignment has associated grades
      if (response.status === 409) {
        return res.status(409).json({ message: 'Cannot delete assignment with associated grades' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting assignment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

