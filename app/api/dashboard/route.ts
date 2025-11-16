import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await auth.getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's memes
    const memes = await db.getMemesByUserId(user.id, 100);

    // Calculate stats
    const totalLikes = memes.reduce((sum, meme) => sum + meme.likes, 0);
    const totalViews = memes.reduce((sum, meme) => sum + meme.views, 0);
    const generationsToday = await db.getGenerationCountToday(user.id);

    return NextResponse.json({
      success: true,
      memes,
      stats: {
        totalMemes: memes.length,
        totalLikes,
        totalViews,
        generationsToday,
        dailyLimit: user.dailyLimit,
      },
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
