import clientPromise from '../../lib/mongo';

export default async function handler(req, res) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { block, floor, qtr, amount, paymentMode } = req.body;

    // Validate required fields
    if (!block || !floor || !qtr || !amount || !paymentMode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const client = await clientPromise;
    const db = client.db('agvdonation');
    const collection = db.collection('donations');

    // Check if donation already exists for this location
    const existingDonation = await collection.findOne({ block, floor, qtr });
    if (existingDonation) {
      return res.status(400).json({ message: 'Donation already exists for this location' });
    }

    // Create new donation
    const donation = {
      block,
      floor,
      qtr,
      amount: Number(amount),
      paymentMode,
      createdAt: new Date()
    };

    const result = await collection.insertOne(donation);

    return res.status(201).json({
      message: 'Donation recorded successfully',
      donation: {
        ...donation,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 