import { put } from '@vercel/blob';

/**
 * Check if Vercel Blob is configured
 */
function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * Upload image from URL to Vercel Blob storage
 * This ensures images persist beyond DALL-E's temporary URLs
 * Falls back to original URL if blob storage is not configured
 */
export async function uploadImageToBlob(imageUrl: string, filename: string): Promise<string> {
  // If blob storage is not configured, return the original URL
  if (!isBlobConfigured()) {
    console.warn('Vercel Blob not configured. Using temporary DALL-E URL. Set BLOB_READ_WRITE_TOKEN environment variable for persistent storage.');
    return imageUrl;
  }

  try {
    // Fetch the image from DALL-E
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Upload to Vercel Blob
    const { url } = await put(filename, blob, {
      access: 'public',
      contentType: blob.type || 'image/png',
    });

    console.log('Image uploaded to blob storage:', url);
    return url;
  } catch (error: any) {
    console.error('Failed to upload image to blob storage:', error);
    console.warn('Falling back to temporary DALL-E URL');
    return imageUrl; // Fallback to original URL
  }
}

/**
 * Generate a unique filename for the meme image
 */
export function generateMemeFilename(userId?: number): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const userPrefix = userId ? `user${userId}` : 'guest';
  return `memes/${userPrefix}_${timestamp}_${random}.png`;
}
