import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getTeachers(req, res, session);
    case 'POST':
      return createTeacher(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all teachers with optional filtering
async function getTeachers(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      department, 
      status, 
      search
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();
    if (department) params.append('department', department as string);
    if (status) params.append('status', status as string);
    if (search) params.append('search', search as string);

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/teachers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new teacher
async function createTeacher(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Check if user has permission to create teachers
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/teachers`;
    const response = await fetch(apiUrl, {
      method: 'POST',
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
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

