import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

export async function POST(request: Request) {
  try {
    const { block, floor, qtr } = await request.json();

    if (!block || !floor || !qtr) {
      return NextResponse.json(
        { message: 'Block, floor, and quarter parameters are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('donations').deleteOne({ block, floor, qtr });

    return NextResponse.json(
      { message: `Donation for Block ${block}, Floor ${floor}, Quarter ${qtr} has been reset` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting cell donation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 