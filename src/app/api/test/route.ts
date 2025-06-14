import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('donations');

    // Test data
    const testDonation = {
      block: 'A',
      floor: 1,
      qtr: 1,
      amount: 1000,
      paymentMode: 'online',
      timestamp: new Date()
    };

    // Insert test data
    await collection.insertOne(testDonation);

    // Fetch all donations to verify
    const donations = await collection.find({}).toArray();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      testData: donations
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'MongoDB connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 