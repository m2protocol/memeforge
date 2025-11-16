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
Style: Simple cartoon amphibian character
- ORIGINAL design - do NOT copy existing meme characters
- Friendly cartoon animal style with simple features
- Solid flat colors (green body, white/black eyes)
- Thick black outlines (3px) around all shapes
- Round expressive eyes with visible pupils
- Simple smiling or emotional mouth
- Basic body with arms and legs
- Modern clean cartoon aesthetic - NOT retro meme style
`,

  wojak: `
Style: Simple cartoon human character
- ORIGINAL design - do NOT copy existing meme faces
- Friendly cartoon person style
- Normal human proportions (not distorted)
- Normal-sized eyes (not tiny dots)
- Expressive facial features
- Flat skin tone colors
- Simple hair or bald head
- Modern cartoon aesthetic - clean and friendly
`,

  cartoon: `
Style: Modern clean cartoon character
- Original friendly character design
- Bold thick black outlines (3px) on everything
- Solid flat bright colors, no gradients
- Normal body proportions (not weird or distorted)
- Large friendly expressive eyes with pupils
- Happy or emotional expressions
- Clean modern cartoon vector style
- Cute and appealing aesthetic
`,

  general: `
Style: Modern cartoon illustration
- Clean, professional cartoon style
- Thick black outlines (3px) on all shapes
- Flat bright solid colors only
- Characters with normal friendly proportions
- Expressive eyes and mouths
- Simple but appealing design
- Modern vector cartoon aesthetic
- NOT retro/old meme style
`,
};

/**
 * Enhance user prompt with style enforcement
 */
export function enhancePrompt(options: PromptOptions): string {
  const { userPrompt, characterPrompt, assetDescriptions, style = 'general', brandColor1, brandColor2, logoDescription } = options;

  let enhancedPrompt = '';

  // 0. CRITICAL ANTI-COPY INSTRUCTIONS FIRST
  enhancedPrompt += `${'='.repeat(70)}\n`;
  enhancedPrompt += `CRITICAL INSTRUCTIONS - READ FIRST\n`;
  enhancedPrompt += `${'='.repeat(70)}\n`;
  enhancedPrompt += `YOU MUST CREATE 100% ORIGINAL CONTENT\n\n`;
  enhancedPrompt += `FORBIDDEN TO COPY:\n`;
  enhancedPrompt += `✗ NO Dogecoin, Shiba Inu dog designs\n`;
  enhancedPrompt += `✗ NO Bitcoin logos or symbols\n`;
  enhancedPrompt += `✗ NO existing memecoin characters\n`;
  enhancedPrompt += `✗ NO retro rage comic / troll face style\n`;
  enhancedPrompt += `✗ NO weird distorted meme faces\n\n`;
  enhancedPrompt += `REQUIRED STYLE:\n`;
  enhancedPrompt += `✓ Modern clean cartoon characters\n`;
  enhancedPrompt += `✓ Friendly, appealing designs\n`;
  enhancedPrompt += `✓ Normal proportions (not distorted)\n`;
  enhancedPrompt += `✓ Completely ORIGINAL designs\n`;
  enhancedPrompt += `${'='.repeat(70)}\n\n`;

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
    enhancedPrompt += `\n${'='.repeat(70)}\n`;
    enhancedPrompt += `COIN/TOKEN DESIGN REQUIREMENTS - MANDATORY\n`;
    enhancedPrompt += `${'='.repeat(70)}\n\n`;

    enhancedPrompt += `USER WANTS A COIN WITH: "${logoDescription}"\n\n`;

    enhancedPrompt += `STEP 1 - UNDERSTAND WHAT TO DRAW:\n`;
    enhancedPrompt += `Parse the user's description literally. If they say:\n`;
    enhancedPrompt += `- "dog icon" = Draw a simple dog face\n`;
    enhancedPrompt += `- "cat with crown" = Draw a cat wearing a crown\n`;
    enhancedPrompt += `- "letter M" = Draw the letter M\n`;
    enhancedPrompt += `- "rocket" = Draw a rocket ship\n\n`;

    enhancedPrompt += `STEP 2 - WHAT YOU MUST NOT DRAW:\n`;
    enhancedPrompt += `FORBIDDEN - DO NOT DRAW ANY OF THESE:\n`;
    enhancedPrompt += `  ✗ Bitcoin "B" symbol with lines (₿)\n`;
    enhancedPrompt += `  ✗ Ethereum diamond symbol (Ξ)\n`;
    enhancedPrompt += `  ✗ Dogecoin "D" logo\n`;
    enhancedPrompt += `  ✗ ANY cryptocurrency logo that exists in real life\n`;
    enhancedPrompt += `  ✗ Generic "crypto" symbols or icons\n`;
    enhancedPrompt += `  ✗ Dollar signs, stock market symbols\n\n`;

    enhancedPrompt += `STEP 3 - HOW TO DRAW THE COIN:\n`;
    enhancedPrompt += `1. Draw a simple CIRCLE (the coin shape)\n`;
    enhancedPrompt += `2. Inside the circle, draw ONLY what the user described\n`;
    enhancedPrompt += `3. Use simple cartoon style - thick black outlines, flat colors\n`;
    enhancedPrompt += `4. Make it big enough to see clearly in the image\n`;
    enhancedPrompt += `5. Place it visibly (character holding it, on display, etc.)\n\n`;

    enhancedPrompt += `FOR THIS SPECIFIC REQUEST ("${logoDescription}"):\n`;
    enhancedPrompt += `Draw a circular coin with ${logoDescription} inside - BE LITERAL AND EXACT\n`;
    enhancedPrompt += `DO NOT substitute with Bitcoin or any other existing crypto logo\n`;
    enhancedPrompt += `${'='.repeat(70)}\n\n`;
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
