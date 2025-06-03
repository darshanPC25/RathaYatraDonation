import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { block, floor, qtr, amount, paymentMode } = body;

    // Validate required fields
    if (!block || !floor || !qtr || !amount || !paymentMode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if donation already exists for this location
    const existingDonation = await db.collection('donations').findOne({
      block,
      floor,
      qtr,
    });

    if (existingDonation) {
      return NextResponse.json(
        { message: 'Donation already exists for this location' },
        { status: 400 }
      );
    }

    // Insert new donation
    const result = await db.collection('donations').insertOne({
      block,
      floor,
      qtr,
      amount: Number(amount),
      paymentMode,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Donation recorded successfully', donation: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error recording donation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 