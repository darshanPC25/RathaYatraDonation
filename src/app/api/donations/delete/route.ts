import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(request: Request) {
  try {
    const { block, floor, qtr } = await request.json();

    if (!block || !floor || !qtr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Delete the donation
    const result = await db.collection('donations').deleteOne({
      block,
      floor,
      qtr: Number(qtr)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting donation:', error);
    return NextResponse.json(
      { error: 'Failed to delete donation' },
      { status: 500 }
    );
  }
} 