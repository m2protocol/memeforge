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
    console.warn('[BLOB] Not configured - BLOB_READ_WRITE_TOKEN not found');
    console.warn('[BLOB] Using temporary DALL-E URL (will expire in ~1 hour)');
    return imageUrl;
  }

  console.log('[BLOB] Starting upload process...');
  console.log('[BLOB] Filename:', filename);
  console.log('[BLOB] Source URL:', imageUrl.substring(0, 100) + '...');

  try {
    // Fetch the image from DALL-E
    console.log('[BLOB] Fetching image from DALL-E...');
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log('[BLOB] Image fetched successfully, size:', blob.size, 'bytes');
    console.log('[BLOB] Content type:', blob.type);

    // Upload to Vercel Blob
    console.log('[BLOB] Uploading to Vercel Blob storage...');
    const { url } = await put(filename, blob, {
      access: 'public',
      contentType: blob.type || 'image/png',
    });

    console.log('[BLOB] ✓ Upload successful!');
    console.log('[BLOB] Permanent URL:', url);
    return url;
  } catch (error: any) {
    console.error('[BLOB] ✗ Upload failed:', error.message);
    console.error('[BLOB] Full error:', error);
    console.warn('[BLOB] Falling back to temporary DALL-E URL');
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
