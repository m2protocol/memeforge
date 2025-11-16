/**
 * MemeForge Prompt Engineering Layer
 * Ensures consistent cartoon crypto meme style across all generations
 */

export interface PromptOptions {
  userPrompt: string;
  characterPrompt?: string;
  assetDescriptions?: string[];
  style?: 'pepe' | 'wojak' | 'cartoon' | 'general';
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
  const { userPrompt, characterPrompt, assetDescriptions, style = 'general' } = options;

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

  // 4. Add character consistency if character is provided
  if (characterPrompt) {
    enhancedPrompt += STYLE_RULES.character;
    enhancedPrompt += '\n\n';
    enhancedPrompt += `CHARACTER DESCRIPTION:\n${characterPrompt}\n\n`;
  }

  // 5. Add asset descriptions if provided
  if (assetDescriptions && assetDescriptions.length > 0) {
    enhancedPrompt += 'CUSTOM ASSETS TO INCLUDE:\n';
    assetDescriptions.forEach((asset, i) => {
      enhancedPrompt += `- Asset ${i + 1}: ${asset}\n`;
    });
    enhancedPrompt += '\nEnsure assets are rendered in the same cartoon style, maintaining their recognizable features.\n\n';
  }

  // 6. Add text rules if prompt mentions text
  if (userPrompt.toLowerCase().includes('text') ||
      userPrompt.toLowerCase().includes('sign') ||
      userPrompt.toLowerCase().includes('number') ||
      userPrompt.toLowerCase().includes('word')) {
    enhancedPrompt += STYLE_RULES.text;
    enhancedPrompt += '\n\n';
  }

  // 7. Add the actual user prompt
  enhancedPrompt += 'USER REQUEST:\n';
  enhancedPrompt += userPrompt;
  enhancedPrompt += '\n\n';

  // 8. Final enforcement reminder
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

export function getDALLEParams(enhancedPrompt: string): DALLEParams {
  return {
    prompt: enhancedPrompt,
    n: 1,
    size: '1024x1024', // Square format best for memes
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
