import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const memeId = parseInt(params.id);
    if (isNaN(memeId)) {
      return NextResponse.json({ error: 'Invalid meme ID' }, { status: 400 });
    }

    const { isPublic } = await request.json();

    await sql`
      UPDATE memes
      SET is_public = ${isPublic}
      WHERE id = ${memeId} AND user_id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update visibility' },
      { status: 500 }
    );
  }
}
