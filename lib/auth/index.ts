import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, User } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'memeforge-secret-key';

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

export const auth = {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  // Generate JWT token
  generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });
  },

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  },

  // Register new user
  async register(email: string, username: string, password: string): Promise<{ user: User; token: string }> {
    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await db.createUser(email, username, passwordHash);

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  },

  // Login user
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Get user
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  },

  // Get current user from token
  async getCurrentUser(token: string): Promise<User | null> {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    return db.getUserById(payload.userId);
  },
};

// Validation helpers
export const validate = {
  email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  username(username: string): boolean {
    // 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  password(password: string): boolean {
    // At least 6 characters
    return password.length >= 6;
  },
};
