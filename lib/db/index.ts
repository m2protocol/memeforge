import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export types
export type {
  User,
  Character,
  Asset,
  Meme,
  Generation,
} from '@prisma/client';

// Database helper functions
export const db = {
  // Users
  async createUser(email: string, username: string, passwordHash: string) {
    return prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Characters
  async createCharacter(
    userId: number,
    name: string,
    description: string,
    stylePrompt: string,
    referenceImageUrl?: string
  ) {
    return prisma.character.create({
      data: {
        userId,
        name,
        description,
        stylePrompt,
        referenceImageUrl,
      },
    });
  },

  async getCharactersByUserId(userId: number) {
    return prisma.character.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async getCharacterById(id: number) {
    return prisma.character.findUnique({
      where: {
        id,
        isActive: true,
      },
    });
  },

  // Assets
  async createAsset(
    userId: number,
    name: string,
    imageUrl: string,
    assetType: string,
    description?: string
  ) {
    return prisma.asset.create({
      data: {
        userId,
        name,
        imageUrl,
        assetType,
        description,
      },
    });
  },

  async getAssetsByUserId(userId: number) {
    return prisma.asset.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Memes
  async createMeme(
    prompt: string,
    enhancedPrompt: string,
    imageUrl: string,
    userId?: number,
    characterId?: number,
    isPublic: boolean = false,
    format?: string,
    brandColor1?: string,
    brandColor2?: string,
    logoUrl?: string
  ) {
    return prisma.meme.create({
      data: {
        prompt,
        enhancedPrompt,
        imageUrl,
        userId,
        characterId,
        isPublic,
        format,
        brandColor1,
        brandColor2,
        logoUrl,
      },
    });
  },

  async getPublicMemes(limit: number = 50, offset: number = 0) {
    return prisma.meme.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  },

  async getMemesByUserId(userId: number, limit: number = 50) {
    return prisma.meme.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },

  async incrementMemeViews(memeId: number) {
    return prisma.meme.update({
      where: { id: memeId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  },

  async incrementMemeLikes(memeId: number) {
    return prisma.meme.update({
      where: { id: memeId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  },

  async updateMemeVisibility(memeId: number, userId: number, isPublic: boolean) {
    return prisma.meme.updateMany({
      where: {
        id: memeId,
        userId,
      },
      data: {
        isPublic,
      },
    });
  },

  async deleteMeme(memeId: number, userId: number) {
    return prisma.meme.deleteMany({
      where: {
        id: memeId,
        userId,
      },
    });
  },

  // Generations (Rate Limiting)
  async createGeneration(userId?: number, sessionId?: string, ipAddress?: string) {
    return prisma.generation.create({
      data: {
        userId,
        sessionId,
        ipAddress,
      },
    });
  },

  async getGenerationCountToday(userId?: number, sessionId?: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.generation.count({
      where: {
        ...(userId ? { userId } : { sessionId }),
        createdAt: {
          gte: today,
        },
      },
    });

    return count;
  },
};
