import { NextRequest, NextResponse } from 'next/server';
import { generateMemeImage } from '@/lib/ai/dalle';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, characterId } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    // Get user from token if provided
    const authHeader = request.headers.get('authorization');
    let userId: number | undefined;
    let dailyLimit = 5; // Default for guests

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await auth.getCurrentUser(token);
      if (user) {
        userId = user.id;
        dailyLimit = user.dailyLimit;
      }
    }

    // Check rate limit
    const sessionId = !userId ? request.headers.get('x-session-id') || undefined : undefined;
    const generationCount = await db.getGenerationCountToday(userId, sessionId);

    if (generationCount >= dailyLimit) {
      return NextResponse.json(
        { error: `Daily limit of ${dailyLimit} generations reached. ${userId ? 'Come back tomorrow!' : 'Sign up for 50/day!'}` },
        { status: 429 }
      );
    }

    // Get character prompt if characterId is provided
    let characterPrompt: string | undefined;
    if (characterId) {
      const character = await db.getCharacterById(characterId);
      if (character) {
        characterPrompt = character.style_prompt;
      }
    }

    // Generate image
    const result = await generateMemeImage({
      userPrompt: prompt,
      style: style || 'general',
      characterPrompt,
    });

    // Save to database
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;

    await db.createGeneration(userId, sessionId, ipAddress);

    const meme = await db.createMeme(
      result.originalPrompt,
      result.enhancedPrompt,
      result.imageUrl,
      userId,
      characterId,
      false // Not public by default
    );

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      memeId: meme.id,
      remainingGenerations: dailyLimit - generationCount - 1,
    });
  } catch (error: any) {
    console.error('Generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
