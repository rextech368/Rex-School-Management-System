import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { EnrollmentStatus } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid enrollment ID' });
  }

  switch (req.method) {
    case 'GET':
      return getEnrollment(req, res, session, id);
    case 'PUT':
      return updateEnrollment(req, res, session, id);
    case 'DELETE':
      return deleteEnrollment(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific enrollment by ID
async function getEnrollment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }
      throw new Error('Failed to fetch enrollment');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching enrollment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an enrollment
async function updateEnrollment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Check if user has permission to update enrollment
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    const isStudent = session.user.role === 'student';
    const isTeacher = session.user.role === 'teacher';
    
    // Get the enrollment to check permissions
    const enrollmentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/${id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    
    if (!enrollmentResponse.ok) {
      if (enrollmentResponse.status === 404) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }
      throw new Error('Failed to fetch enrollment');
    }
    
    const enrollment = await enrollmentResponse.json();
    
    // Students can only update their own enrollments and only to drop classes
    if (isStudent) {
      if (enrollment.studentId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own enrollments' });
      }
      
      if (status !== EnrollmentStatus.DROPPED) {
        return res.status(403).json({ message: 'Forbidden: Students can only drop classes' });
      }
    }
    
    // Teachers need to be teaching the class to update enrollments
    if (isTeacher) {
      // Check if teacher is assigned to the class
      const classResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${enrollment.classId}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      if (!classResponse.ok) {
        throw new Error('Failed to fetch class details');
      }
      
      const classData = await classResponse.json();
      
      if (classData.teacherId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update enrollments for classes you teach' });
      }
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific error cases
      if (response.status === 400 && errorData.message.includes('full')) {
        return res.status(400).json({ message: 'Cannot enroll student. Class is full.' });
      }
      
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating enrollment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an enrollment
async function deleteEnrollment(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Only admins can delete enrollments
    if (!['admin', 'registrar'].includes(session.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting enrollment ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

