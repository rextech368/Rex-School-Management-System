import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getCourses(req, res);
    case 'POST':
      return createCourse(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all courses with optional filtering
async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      department, 
      gradeLevel, 
      isActive, 
      search 
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (department) params.append('department', department as string);
    if (gradeLevel) params.append('gradeLevel', gradeLevel as string);
    if (isActive) params.append('isActive', isActive as string);
    if (search) params.append('search', search as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new course
async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    // Check if user has permission to create courses
    if (!['admin', 'registrar'].includes(session.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

