import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memeId = parseInt(id);

    if (isNaN(memeId)) {
      return NextResponse.json(
        { error: 'Invalid meme ID' },
        { status: 400 }
      );
    }

    await db.incrementMemeLikes(memeId);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Failed to like meme:', error);
    return NextResponse.json(
      { error: 'Failed to like meme' },
      { status: 500 }
    );
  }
}
