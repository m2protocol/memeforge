import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  daily_limit: number;
  is_active: boolean;
}

export interface Character {
  id: number;
  user_id: number;
  name: string;
  description: string;
  style_prompt: string;
  reference_image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface Asset {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  image_url: string;
  asset_type: 'logo' | 'coin' | 'mascot' | 'custom';
  created_at: Date;
  is_active: boolean;
}

export interface Meme {
  id: number;
  user_id?: number;
  prompt: string;
  enhanced_prompt: string;
  image_url: string;
  character_id?: number;
  is_public: boolean;
  likes: number;
  views: number;
  created_at: Date;
}

export interface Generation {
  id: number;
  user_id?: number;
  session_id?: string;
  ip_address?: string;
  created_at: Date;
}

// Database helper functions
export const db = {
  // Users
  async createUser(email: string, username: string, passwordHash: string): Promise<User> {
    const result = await sql<User>`
      INSERT INTO users (email, username, password_hash)
      VALUES (${email}, ${username}, ${passwordHash})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await sql<User>`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    return result.rows[0] || null;
  },

  async getUserById(id: number): Promise<User | null> {
    const result = await sql<User>`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `;
    return result.rows[0] || null;
  },

  // Characters
  async createCharacter(userId: number, name: string, description: string, stylePrompt: string, referenceImageUrl?: string): Promise<Character> {
    const result = await sql<Character>`
      INSERT INTO characters (user_id, name, description, style_prompt, reference_image_url)
      VALUES (${userId}, ${name}, ${description}, ${stylePrompt}, ${referenceImageUrl || null})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getCharactersByUserId(userId: number): Promise<Character[]> {
    const result = await sql<Character>`
      SELECT * FROM characters
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `;
    return result.rows;
  },

  async getCharacterById(id: number): Promise<Character | null> {
    const result = await sql<Character>`
      SELECT * FROM characters WHERE id = ${id} AND is_active = true LIMIT 1
    `;
    return result.rows[0] || null;
  },

  // Assets
  async createAsset(userId: number, name: string, imageUrl: string, assetType: string, description?: string): Promise<Asset> {
    const result = await sql<Asset>`
      INSERT INTO assets (user_id, name, image_url, asset_type, description)
      VALUES (${userId}, ${name}, ${imageUrl}, ${assetType}, ${description || null})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getAssetsByUserId(userId: number): Promise<Asset[]> {
    const result = await sql<Asset>`
      SELECT * FROM assets
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `;
    return result.rows;
  },

  // Memes
  async createMeme(
    prompt: string,
    enhancedPrompt: string,
    imageUrl: string,
    userId?: number,
    characterId?: number,
    isPublic: boolean = false
  ): Promise<Meme> {
    const result = await sql<Meme>`
      INSERT INTO memes (user_id, prompt, enhanced_prompt, image_url, character_id, is_public)
      VALUES (${userId || null}, ${prompt}, ${enhancedPrompt}, ${imageUrl}, ${characterId || null}, ${isPublic})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getPublicMemes(limit: number = 50, offset: number = 0): Promise<Meme[]> {
    const result = await sql<Meme>`
      SELECT * FROM memes
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result.rows;
  },

  async getMemesByUserId(userId: number, limit: number = 50): Promise<Meme[]> {
    const result = await sql<Meme>`
      SELECT * FROM memes
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows;
  },

  async incrementMemeViews(memeId: number): Promise<void> {
    await sql`
      UPDATE memes
      SET views = views + 1
      WHERE id = ${memeId}
    `;
  },

  async incrementMemeLikes(memeId: number): Promise<void> {
    await sql`
      UPDATE memes
      SET likes = likes + 1
      WHERE id = ${memeId}
    `;
  },

  // Generations (Rate Limiting)
  async createGeneration(userId?: number, sessionId?: string, ipAddress?: string): Promise<Generation> {
    const result = await sql<Generation>`
      INSERT INTO generations (user_id, session_id, ip_address)
      VALUES (${userId || null}, ${sessionId || null}, ${ipAddress || null})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getGenerationCountToday(userId?: number, sessionId?: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let result;
    if (userId) {
      result = await sql<{ count: string }>`
        SELECT COUNT(*) as count FROM generations
        WHERE user_id = ${userId} AND created_at >= ${today.toISOString()}
      `;
    } else if (sessionId) {
      result = await sql<{ count: string }>`
        SELECT COUNT(*) as count FROM generations
        WHERE session_id = ${sessionId} AND created_at >= ${today.toISOString()}
      `;
    } else {
      return 0;
    }

    return parseInt(result.rows[0].count);
  },
};
