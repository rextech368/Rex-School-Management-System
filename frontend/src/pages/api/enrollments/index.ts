import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { EnrollmentStatus } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getEnrollments(req, res, session);
    case 'POST':
      return createEnrollment(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get enrollments with filtering options
async function getEnrollments(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      studentId, 
      classId, 
      termId, 
      status, 
      teacherId 
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId as string);
    if (classId) params.append('classId', classId as string);
    if (termId) params.append('termId', termId as string);
    if (status) params.append('status', status as string);
    if (teacherId) params.append('teacherId', teacherId as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/enrollments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch enrollments');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new enrollment
async function createEnrollment(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { classId, studentId, status = EnrollmentStatus.ENROLLED } = req.body;

    if (!classId || !studentId) {
      return res.status(400).json({ message: 'Class ID and Student ID are required' });
    }

    // Check if user has permission to create enrollment
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    const isStudent = session.user.role === 'student';
    const isTeacher = session.user.role === 'teacher';
    
    // Students can only enroll themselves
    if (isStudent && studentId !== session.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only enroll yourself' });
    }
    
    // Teachers need to be teaching the class to enroll students
    if (isTeacher) {
      // Check if teacher is assigned to the class
      const classResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      if (!classResponse.ok) {
        throw new Error('Failed to fetch class details');
      }
      
      const classData = await classResponse.json();
      
      if (classData.teacherId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only enroll students in classes you teach' });
      }
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/enrollments`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        classId,
        studentId,
        status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific error cases
      if (response.status === 409) {
        return res.status(409).json({ message: 'Student is already enrolled in this class' });
      }
      
      if (response.status === 400 && errorData.message.includes('full')) {
        return res.status(400).json({ message: 'Class is full. Student has been added to the waitlist.' });
      }
      
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

