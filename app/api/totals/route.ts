import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Get grand total
    const grandTotalResult = await db
      .collection('donations')
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    const grandTotal = grandTotalResult[0]?.total || 0;

    // Get block-wise totals
    const blockTotalsResult = await db
      .collection('donations')
      .aggregate([
        {
          $group: {
            _id: '$block',
            total: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            block: '$_id',
            total: 1,
          },
        },
        {
          $sort: { block: 1 },
        },
      ])
      .toArray();

    return NextResponse.json({
      grandTotal,
      blockTotals: blockTotalsResult,
    });
  } catch (error) {
    console.error('Error fetching totals:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 