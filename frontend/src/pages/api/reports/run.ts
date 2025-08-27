import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'POST':
      return runReport(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Run a report with specified parameters
async function runReport(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const { 
      reportId,
      parameters,
      format = 'json'
    } = req.body;

    // Validate required fields
    if (!reportId) {
      return res.status(400).json({ message: 'Report ID is required' });
    }

    // Call backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/run`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        reportId,
        parameters,
        format,
        generatedBy: session.user.id,
        generatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error running report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

