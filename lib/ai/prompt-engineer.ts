/**
 * MemeForge Prompt Engineering Layer
 * Ensures consistent cartoon crypto meme style across all generations
 */

export interface PromptOptions {
  userPrompt: string;
  characterPrompt?: string;
  assetDescriptions?: string[];
  style?: 'pepe' | 'wojak' | 'cartoon' | 'general';
  format?: 'horizontal' | 'vertical' | 'square';
  brandColor1?: string;
  brandColor2?: string;
  logoDescription?: string;
}

/**
 * Core style enforcement rules
 */
const STYLE_RULES = {
  base: `
CRITICAL STYLE REQUIREMENTS:
- Cartoon illustration style ONLY, absolutely no photorealism
- Crypto meme aesthetic (Pepe, Wojak, classic internet meme style)
- Flat colors with bold outlines (2-4px black outlines)
- Simple, exaggerated features and expressions
- Clean, vector-like appearance
- NO gradients, NO subtle shading, NO complex textures
- NO small details or intricate patterns
- NO realistic lighting or shadows
- NO 3D rendering effects
`,

  text: `
TEXT RENDERING RULES:
- If text is needed, make it BOLD, CLEAN, and READABLE
- Use simple block letters or comic-style fonts
- Text should be straight and properly aligned
- NO distorted, warped, or illegible text
- NO fancy typography or decorative fonts
- Keep text minimal and impactful
`,

  character: `
CHARACTER CONSISTENCY:
- Maintain exact character features across all poses
- Same face shape, eye style, and proportions
- Same color palette
- Consistent line weight
- Same level of detail/simplification
`,

  composition: `
COMPOSITION RULES:
- Clear focal point
- Simple background (solid color or basic pattern)
- Avoid cluttered scenes
- Strong silhouettes
- Exaggerated poses and expressions
`,
};

/**
 * Style presets for different meme types
 */
const STYLE_PRESETS = {
  pepe: `
Style reference: Classic Pepe the Frog meme style
- Green frog character with simple features
- Flat green color (#66BB6A or similar)
- Black outline, white eyes with black pupils
- Exaggerated expressions
- Simple body proportions
`,

  wojak: `
Style reference: Wojak/Feels Guy meme style
- Simple humanoid character
- Minimal facial features (dots for eyes, simple line for mouth)
- Pale/pink skin tone (#FFE0BD or similar)
- Bald or simple hair
- Exaggerated emotional expressions
`,

  cartoon: `
Style reference: Modern cartoon crypto character
- Bold outlines and flat colors
- Simplified anatomy
- Expressive eyes and mouth
- Fun, energetic vibe
- Clean vector-like appearance
`,

  general: `
Style reference: Crypto meme cartoon aesthetic
- Internet meme art style
- Bold, simple, and immediately readable
- Exaggerated features for comedic effect
- Flat color design
`,
};

/**
 * Enhance user prompt with style enforcement
 */
export function enhancePrompt(options: PromptOptions): string {
  const { userPrompt, characterPrompt, assetDescriptions, style = 'general', brandColor1, brandColor2, logoDescription } = options;

  let enhancedPrompt = '';

  // 1. Add base style rules
  enhancedPrompt += STYLE_RULES.base;
  enhancedPrompt += '\n\n';

  // 2. Add style preset
  enhancedPrompt += STYLE_PRESETS[style];
  enhancedPrompt += '\n\n';

  // 3. Add composition rules
  enhancedPrompt += STYLE_RULES.composition;
  enhancedPrompt += '\n\n';

  // 4. Add branding colors if provided
  if (brandColor1 || brandColor2) {
    enhancedPrompt += 'BRANDING COLORS TO USE:\n';
    if (brandColor1) enhancedPrompt += `- Primary brand color: ${brandColor1} (use this as the main color theme)\n`;
    if (brandColor2) enhancedPrompt += `- Secondary brand color: ${brandColor2} (use this as accent color)\n`;
    enhancedPrompt += 'Incorporate these colors naturally into the meme while maintaining cartoon style.\n\n';
  }

  // 5. Add logo/coin description if provided
  if (logoDescription) {
    enhancedPrompt += `LOGO/COIN TO INCLUDE:\n${logoDescription}\n`;
    enhancedPrompt += 'Include this logo/coin in the meme in a natural way (character holding it, background element, etc.) while keeping cartoon style.\n\n';
  }

  // 6. Add character consistency if character is provided
  if (characterPrompt) {
    enhancedPrompt += STYLE_RULES.character;
    enhancedPrompt += '\n\n';
    enhancedPrompt += `CHARACTER DESCRIPTION:\n${characterPrompt}\n\n`;
  }

  // 7. Add asset descriptions if provided
  if (assetDescriptions && assetDescriptions.length > 0) {
    enhancedPrompt += 'CUSTOM ASSETS TO INCLUDE:\n';
    assetDescriptions.forEach((asset, i) => {
      enhancedPrompt += `- Asset ${i + 1}: ${asset}\n`;
    });
    enhancedPrompt += '\nEnsure assets are rendered in the same cartoon style, maintaining their recognizable features.\n\n';
  }

  // 8. Add text rules if prompt mentions text
  if (userPrompt.toLowerCase().includes('text') ||
      userPrompt.toLowerCase().includes('sign') ||
      userPrompt.toLowerCase().includes('number') ||
      userPrompt.toLowerCase().includes('word')) {
    enhancedPrompt += STYLE_RULES.text;
    enhancedPrompt += '\n\n';
  }

  // 9. Add the actual user prompt
  enhancedPrompt += 'USER REQUEST:\n';
  enhancedPrompt += userPrompt;
  enhancedPrompt += '\n\n';

  // 10. Final enforcement reminder
  enhancedPrompt += `
FINAL REMINDER:
Create this as a cartoon crypto meme illustration with:
- Flat colors and bold black outlines
- Simple, exaggerated features
- Clean, meme-ready aesthetic
- NO photorealism or complex details
- Style must be consistent and recognizable as a crypto meme
`;

  return enhancedPrompt.trim();
}

/**
 * Validate and clean user prompts
 */
export function cleanUserPrompt(prompt: string): string {
  // Remove potentially problematic phrases
  let cleaned = prompt.trim();

  // Remove style-breaking requests
  const badPhrases = [
    'realistic', 'photorealistic', 'photo', 'photograph',
    'detailed', 'intricate', 'complex shading',
    '3d render', 'unreal engine', 'octane render',
    'hyperrealistic', 'lifelike'
  ];

  badPhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  return cleaned.trim();
}

/**
 * Generate DALL-E specific parameters
 */
export interface DALLEParams {
  prompt: string;
  n?: number;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export function getDALLEParams(enhancedPrompt: string, format?: 'horizontal' | 'vertical' | 'square'): DALLEParams {
  const sizeMap = {
    square: '1024x1024',
    horizontal: '1792x1024',
    vertical: '1024x1792',
  };

  return {
    prompt: enhancedPrompt,
    n: 1,
    size: sizeMap[format || 'square'] as '1024x1024' | '1024x1792' | '1792x1024',
    quality: 'standard', // Standard is faster and cheaper, good enough for cartoon style
    style: 'vivid', // Vivid gives more saturated colors, better for memes
  };
}

/**
 * Example usage templates
 */
export const PROMPT_EXAMPLES = {
  basic: [
    "Pepe celebrating with rocket ship going to the moon",
    "Wojak panicking while watching red candles",
    "Happy frog holding a giant diamond",
    "Sad character crying over spilled crypto coins",
  ],

  withCharacter: [
    "My character [CHARACTER] dancing with money rain",
    "My character [CHARACTER] surfing on a green candle",
    "My character [CHARACTER] wearing sunglasses looking cool",
  ],

  withAssets: [
    "Pepe holding [MY COIN] with proud expression",
    "Character wearing t-shirt with [MY LOGO]",
    "[MY MASCOT] riding a rocket to the moon",
  ],

  complex: [
    "Pepe as a king sitting on throne made of crypto coins, wearing crown, smug expression",
    "Wojak working at computer with multiple monitors showing charts, stressed face",
    "Happy green frog celebrating with confetti and balloons, holding 'HODL' sign",
  ],
};
