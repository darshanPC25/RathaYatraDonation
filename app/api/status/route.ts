import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');

    if (!block) {
      return NextResponse.json(
        { message: 'Block parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const donations = await db
      .collection('donations')
      .find({ block })
      .project({ floor: 1, qtr: 1, amount: 1, paymentMode: 1, _id: 0 })
      .toArray();

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 