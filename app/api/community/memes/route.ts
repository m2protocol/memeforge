import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const memes = await db.getPublicMemes(50, 0);

    return NextResponse.json({
      success: true,
      memes,
    });
  } catch (error: any) {
    console.error('Failed to fetch community memes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    );
  }
}
