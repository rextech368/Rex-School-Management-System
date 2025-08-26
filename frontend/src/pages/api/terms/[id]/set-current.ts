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

  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return setCurrentTerm(req, res, session, id);
}

// Set a term as the current term
async function setCurrentTerm(req: NextApiRequest, res: NextApiResponse, session: any, id: string) {
  try {
    // Check if user has permission to update terms
    const isAdmin = ['admin', 'registrar'].includes(session.user.role);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/terms/${id}/set-current`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
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
    console.error(`Error setting term ${id} as current:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

