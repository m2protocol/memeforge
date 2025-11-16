import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await auth.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const memeId = parseInt(id);
    if (isNaN(memeId)) {
      return NextResponse.json({ error: 'Invalid meme ID' }, { status: 400 });
    }

    const { isPublic } = await request.json();

    await db.updateMemeVisibility(memeId, user.id, isPublic);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update visibility' },
      { status: 500 }
    );
  }
}
