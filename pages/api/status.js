import clientPromise from '../../lib/mongo';

export default async function handler(req, res) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { block } = req.query;

    if (!block) {
      return res.status(400).json({ message: 'Block parameter is required' });
    }

    const client = await clientPromise;
    const db = client.db('agvdonation');
    const collection = db.collection('donations');

    const donations = await collection
      .find({ block })
      .project({ floor: 1, qtr: 1, _id: 0 })
      .toArray();

    return res.status(200).json({ donations });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 