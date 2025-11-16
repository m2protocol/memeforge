import OpenAI from 'openai';
import { enhancePrompt, getDALLEParams, cleanUserPrompt, PromptOptions } from './prompt-engineer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerationResult {
  imageUrl: string;
  enhancedPrompt: string;
  originalPrompt: string;
}

/**
 * Generate meme image using DALL-E
 */
export async function generateMemeImage(options: PromptOptions): Promise<GenerationResult> {
  try {
    // Clean and enhance the prompt
    const cleanedPrompt = cleanUserPrompt(options.userPrompt);
    const enhancedPrompt = enhancePrompt({
      ...options,
      userPrompt: cleanedPrompt,
    });

    // Get DALL-E parameters
    const dalleParams = getDALLEParams(enhancedPrompt);

    console.log('Generating image with DALL-E...');
    console.log('Enhanced prompt:', enhancedPrompt);

    // Generate image
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dalleParams.prompt,
      n: dalleParams.n,
      size: dalleParams.size,
      quality: dalleParams.quality,
      style: dalleParams.style,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image generated');
    }

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned');
    }

    return {
      imageUrl,
      enhancedPrompt,
      originalPrompt: options.userPrompt,
    };
  } catch (error: any) {
    console.error('DALL-E generation error:', error);
    throw new Error(error.message || 'Failed to generate image');
  }
}

/**
 * Generate image variation (for character consistency)
 */
export async function generateVariation(imageUrl: string): Promise<string> {
  try {
    // Note: DALL-E 3 doesn't support variations directly
    // This would require downloading the image and using DALL-E 2
    // For now, we'll use the character prompt method instead
    throw new Error('Variations not supported with DALL-E 3. Use character prompts instead.');
  } catch (error: any) {
    console.error('Variation generation error:', error);
    throw error;
  }
}

/**
 * Test connection to OpenAI
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const response = await openai.models.list();
    return response.data.length > 0;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
}
