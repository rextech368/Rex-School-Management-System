import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid term ID' });
  }

  switch (req.method) {
    case 'GET':
      return getTerm(req, res, session, id);
    case 'PUT':
      return updateTerm(req, res, session, id);
    case 'DELETE':
      return deleteTerm(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific term by ID
async function getTerm(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Term not found' });
      }
      throw new Error('Failed to fetch term');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching term ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a term
async function updateTerm(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update terms
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      name, 
      code, 
      type, 
      startDate, 
      endDate, 
      registrationStart, 
      registrationEnd, 
      isActive, 
      isCurrent, 
      description, 
      academicYear 
    } = req.body;

    // Validate required fields
    if (!name || !code || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, code, start date, and end date are required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (registrationStart && registrationEnd) {
      const regStart = new Date(registrationStart);
      const regEnd = new Date(registrationEnd);
      
      if (regEnd <= regStart) {
        return res.status(400).json({ message: 'Registration end date must be after registration start date' });
      }
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        name,
        code,
        type,
        startDate,
        endDate,
        registrationStart,
        registrationEnd,
        isActive,
        isCurrent,
        description,
        academicYear
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Term not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating term ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a term
async function deleteTerm(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete terms
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Term not found' });
      }
      
      // Handle case where term has associated data
      if (response.status === 409) {
        return res.status(409).json({ message: 'Cannot delete term with associated classes or enrollments' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting term ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

