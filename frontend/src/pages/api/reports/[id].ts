import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid report ID' });
  }

  switch (req.method) {
    case 'GET':
      return getReport(req, res, session, id);
    case 'PUT':
      return updateReport(req, res, session, id);
    case 'DELETE':
      return deleteReport(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific report by ID
async function getReport(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Report not found' });
      }
      throw new Error('Failed to fetch report');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an existing report
async function updateReport(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    const { 
      title,
      description,
      type,
      parameters,
      isPublic,
      accessRoles,
      schedule
    } = req.body;

    // Validate required fields
    if (!title || !type || !parameters) {
      return res.status(400).json({ message: 'Title, type, and parameters are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`;
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
        parameters,
        isPublic,
        accessRoles,
        schedule,
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Report not found' });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a report
async function deleteReport(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Report not found' });
      }
      throw new Error('Failed to delete report');
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

