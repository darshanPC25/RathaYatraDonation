import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Donation } from '@/types/donation';

export async function POST(request: Request) {
  try {
    const donation: Donation = await request.json();
    console.log('Received donation data:', donation);

    const client = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('donations');

    // Add timestamp
    donation.timestamp = new Date();

    // Ensure qtr is a number
    if (typeof donation.qtr === 'string') {
      donation.qtr = parseInt((donation.qtr as string).replace('Qtr ', ''));
    }

    // Ensure amount is a number
    donation.amount = Number(donation.amount);

    const result = await collection.insertOne(donation);
    console.log('Inserted donation:', result);

    return NextResponse.json({ 
      success: true,
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('Error saving donation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save donation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Fetching donations...');
    const client = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('donations');

    // Fetch all donations and sort by block, floor, and quarter
    const donations = await collection
      .find({})
      .sort({ block: 1, floor: 1, qtr: 1 })
      .project({
        block: 1,
        floor: 1,
        qtr: 1,
        amount: 1,
        paymentMode: 1,
        timestamp: 1,
        _id: 0
      })
      .toArray();

    console.log('Fetched donations:', donations);

    // Convert any string qtr values to numbers and ensure amount is a number
    const processedDonations = donations.map(donation => ({
      ...donation,
      qtr: typeof donation.qtr === 'string' 
        ? parseInt(donation.qtr.replace('Qtr ', ''))
        : donation.qtr,
      amount: Number(donation.amount)
    }));

    return NextResponse.json(processedDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch donations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
