import clientPromise from '../../lib/mongo';

export default async function handler(req, res) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('agvdonation');
    const collection = db.collection('donations');

    // Get grand total
    const grandTotal = await collection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).toArray();

    // Get block-wise totals
    const blockTotals = await collection.aggregate([
      {
        $group: {
          _id: '$block',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();

    return res.status(200).json({
      grandTotal: grandTotal[0]?.total || 0,
      blockTotals: blockTotals.map(block => ({
        block: block._id,
        total: block.total
      }))
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 