import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

export async function POST(request: Request) {
  try {
    const { block } = await request.json();

    if (!block) {
      return NextResponse.json(
        { message: 'Block parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('donations').deleteMany({ block });

    return NextResponse.json(
      { message: `Donations for Block ${block} have been reset` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting block donations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 