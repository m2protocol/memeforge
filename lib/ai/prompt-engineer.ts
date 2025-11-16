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
- Internet meme aesthetic: bold, simple, exaggerated, comedic
- Flat colors with bold black outlines (2-4px thick)
- Simple shapes and minimal details
- Clean, vector-like appearance
- NO gradients, NO subtle shading, NO complex textures
- NO small details or intricate patterns
- NO realistic lighting or shadows
- NO 3D rendering effects

IMPORTANT ORIGINALITY RULES:
- DO NOT copy or reference ANY existing cryptocurrency logos or memecoins (Bitcoin, Dogecoin, Shiba Inu, Pepe Coin, etc.)
- DO NOT use specific recognizable animal breeds (Shiba Inu dogs, specific cat breeds, etc.)
- CREATE ORIGINAL cartoon characters and designs
- If the user describes an animal, make it a GENERIC cartoon version (simple dog, simple cat, simple frog, etc.)
- Focus on the EMOTION and SCENARIO, not copying existing meme formats
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
Style: Classic internet frog meme aesthetic
- Simple amphibian character with minimal features
- Solid flat green color for body
- Thick black outlines around all shapes
- Large white circular eyes with small black dots as pupils
- Wide mouth that can show extreme emotions
- Very simple body with basic limbs
- Exaggerated facial expressions (happy, sad, smug, crying, etc.)
`,

  wojak: `
Style: Classic internet character meme aesthetic
- Very simple humanoid figure with minimal details
- Round/oval head shape
- Dots or small circles for eyes
- Single curved line for mouth showing emotion
- Pale peachy-pink flat color for skin
- Bald head or very simple hair shape
- Minimal body details, focus on face emotion
`,

  cartoon: `
Style: Modern internet meme cartoon
- Bold thick black outlines on everything
- Solid flat colors, no gradients
- Simplified body anatomy with basic shapes
- Large expressive eyes (circles or ovals)
- Exaggerated mouth for emotion
- Clean vector appearance
- Fun, energetic, meme-ready look
`,

  general: `
Style: Internet meme cartoon aesthetic
- Very bold and simple design
- Thick black outlines separating all color areas
- Flat solid colors only
- Exaggerated features for comedy
- Minimal details, maximum impact
- Looks like it could go viral as a meme
- Clean, readable from thumbnail size
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
    enhancedPrompt += 'BRAND COLOR PALETTE:\n';
    if (brandColor1) {
      enhancedPrompt += `- Main color: ${brandColor1} (use as PRIMARY color for character body, background, or main elements)\n`;
    }
    if (brandColor2) {
      enhancedPrompt += `- Accent color: ${brandColor2} (use as SECONDARY color for highlights, accessories, or complementary elements)\n`;
    }
    enhancedPrompt += 'IMPORTANT: These colors MUST be prominently visible in the final image. Apply them to major elements like character body, clothing, background, or objects.\n\n';
  }

  // 5. Add logo/coin description if provided
  if (logoDescription) {
    enhancedPrompt += `CRYPTOCURRENCY COIN/TOKEN TO INCLUDE:\n`;
    enhancedPrompt += `User's coin description: "${logoDescription}"\n\n`;
    enhancedPrompt += `CRITICAL COIN DESIGN RULES - FOLLOW EXACTLY:
- Draw the coin EXACTLY as the user described it above
- DO NOT use Bitcoin symbol (₿), Dogecoin logo, or ANY existing cryptocurrency symbols
- If user says "dog with sunglasses", draw a simple cartoon dog face with sunglasses - NOT the Bitcoin logo
- If user says "cat with crown", draw a simple cartoon cat face with crown - NOT any existing coin logo
- The coin should be a simple CIRCLE with the described image/symbol inside
- Use flat solid colors with thick black outline around the circle
- Keep the design MINIMAL, CLEAN, and ORIGINAL
- The coin should be clearly visible in the scene (character holding it, floating nearby, on display, etc.)
- Size: make the coin prominent enough to see the design clearly

WRONG: Drawing Bitcoin, Ethereum, Dogecoin, or any recognizable crypto logo
RIGHT: Drawing exactly what the user described (dog with sunglasses, letter T, cat face, etc.)
\n`;
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
Create this as an ORIGINAL cartoon crypto meme illustration with:
- Flat colors and bold black outlines
- Simple, exaggerated features
- Clean, meme-ready aesthetic
- NO photorealism or complex details
- DO NOT copy Dogecoin, Bitcoin, Shiba Inu, or ANY existing memecoin designs
- CREATE a completely original character and scene
- If coin is specified, draw EXACTLY what user described, NOT existing crypto logos
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
