import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid teacher ID' });
  }

  switch (req.method) {
    case 'GET':
      return getTeacher(req, res, session, id);
    case 'PUT':
      return updateTeacher(req, res, session, id);
    case 'DELETE':
      return deleteTeacher(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific teacher by ID
async function getTeacher(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/teachers/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      throw new Error('Failed to fetch teacher');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a teacher
async function updateTeacher(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update teachers
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
      teacherId,
      department,
      position,
      hireDate,
      status,
      office,
      officeHours,
      education,
      certifications,
      specializations,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      notes
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/teachers/${id}`;
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
        teacherId,
        department,
        position,
        hireDate,
        status,
        office,
        officeHours,
        education,
        certifications,
        specializations,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        notes
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error updating teacher ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a teacher
async function deleteTeacher(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to delete teachers
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/teachers/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      
      // Handle case where teacher has associated data
      if (response.status === 409) {
        return res.status(409).json({ message: 'Cannot delete teacher with associated classes or other data' });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting teacher ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

