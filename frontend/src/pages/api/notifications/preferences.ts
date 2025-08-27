import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getNotificationPreferences(req, res, session);
    case 'PUT':
      return updateNotificationPreferences(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get notification preferences for the current user
async function getNotificationPreferences(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notifications/preferences`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update notification preferences for the current user
async function updateNotificationPreferences(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      email,
      sms,
      inApp,
      types
    } = req.body;

    // Validate required fields
    if (email === undefined || sms === undefined || inApp === undefined || !types) {
      return res.status(400).json({ message: 'Email, SMS, in-app settings, and notification types are required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notifications/preferences`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        userId: session.user.id,
        email,
        sms,
        inApp,
        types
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

