import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('donations').deleteMany({});

    return NextResponse.json(
      { message: 'All donations have been reset' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting donations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 