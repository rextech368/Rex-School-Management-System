import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }

  switch (req.method) {
    case 'GET':
      return getStudent(req, res, session, id);
    case 'PUT':
      return updateStudent(req, res, session, id);
    case 'DELETE':
      return deleteStudent(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific student by ID
async function getStudent(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/students/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Student not found' });
      }
      throw new Error('Failed to fetch student');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a student
async function updateStudent(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update students
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { 
      firstName, 
      lastName, 
      middleName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      country,
      studentId,
      gradeLevel,
      enrollmentDate,
      status,
      guardianFirstName,
      guardianLastName,
      guardianEmail,
      guardianPhone,
      guardianRelationship,
      guardianAddress,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      medicalInformation,
      notes
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/students/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        firstName, 
        lastName, 
        middleName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        country,
        studentId,
        gradeLevel,
        enrollmentDate,
        status,
        guardianFirstName,
        guardianLastName,
        guardianEmail,
        guardianPhone,
        guardianRelationship,
        guardianAddress,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        medicalInformation,
        notes
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Student not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a student
async function deleteStudent(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete students
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/students/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Handle case where student has associated data
      if (response.status === 409) {
        return res.status(409).json({ message: 'Cannot delete student with associated enrollments or other data' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

