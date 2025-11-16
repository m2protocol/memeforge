import { NextRequest, NextResponse } from 'next/server';
import { auth, validate } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!validate.email(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validate.username(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters, alphanumeric and underscore only' },
        { status: 400 }
      );
    }

    if (!validate.password(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Register user
    const { user, token } = await auth.register(email, username, password);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        dailyLimit: user.daily_limit,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
