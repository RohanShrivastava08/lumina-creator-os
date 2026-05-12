import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export enum Platform {
  LINKEDIN = "LinkedIn",
  INSTAGRAM = "Instagram",
  X = "X (Twitter)"
}

export enum Tone {
  PROFESSIONAL = "Professional",
  CASUAL = "Casual",
  MOTIVATIONAL = "Motivational",
  STORYTELLER = "Storyteller"
}

export enum PostLength {
  SHORT = "Short (Snappy)",
  MEDIUM = "Medium (Balanced)",
  LONG = "Long (Detailed)"
}

export interface GeneratedContent {
  hook: string;
  mainContent: string;
  cta: string;
  hashtags: string[];
  analytics: {
    hookStrength: number;
    readabilityScore: number;
    engagementPotential: number;
    optimizationScore: number;
  };
  carouselIdeas?: string[];
  visualPrompts?: {
    midjourney: string;
    gemini: string;
    leonardo: string;
    stableDiffusion: string;
  };
}

export enum GenerationMode {
  INITIAL = "initial",
  HUMAN = "human",
  STYLE = "style",
  HOOK = "hook",
  CTA = "cta",
  CAROUSEL = "carousel"
}

export async function generateSocialContent(
  topic: string,
  platform: Platform,
  tone: Tone,
  length: PostLength,
  hashtagCount: number,
  mode: GenerationMode = GenerationMode.INITIAL,
  currentContent?: GeneratedContent
): Promise<GeneratedContent> {
  let modeInstruction = "";
  
  switch (mode) {
    case GenerationMode.HUMAN:
      modeInstruction = `REWRITE MODE: Take the following content and make it feel deeply human. Strip away any remaining "AI-isms". Add subtle vulnerability, personal observation, or a slightly unconventional take that a human would have.
      Current Hook: ${currentContent?.hook}
      Current Body: ${currentContent?.mainContent}`;
      break;
    case GenerationMode.STYLE:
      modeInstruction = `REWRITE MODE: Adapt current content into a "High-End Creator" style. Use punchy one-sentence paragraphs, intentional rhythm, and a strong personal brand voice that builds authority without being arrogant.
      Current Hook: ${currentContent?.hook}
      Current Body: ${currentContent?.mainContent}`;
      break;
    case GenerationMode.HOOK:
      modeInstruction = `ENCHANCE MODE: Focus specifically on the Hook. Generate a scroll-stopping, curiosity-driven opening. Use the "Open Loop" technique or a "Pattern Interrupt".
      Topic context: ${topic}`;
      break;
    case GenerationMode.CTA:
      modeInstruction = `ENHANCE MODE: Focus specifically on the CTA. Make it feel authentic, conversational, and low-friction. Avoid generic "Comment below" phrases.
      Topic context: ${topic}`;
      break;
    default:
      modeInstruction = `INITIAL GENERATION: Topic is "${topic}".`;
  }

  const prompt = `
    You are Lumina OS Core, the premium architectural intelligence for world-class founders, creators, and storytellers.
    
    TASK: ${modeInstruction}
    PLATFORM: ${platform}
    TONE: ${tone}
    LENGTH PREFERENCE: ${length}
    
    SYSTEM DIRECTIVES (STRICT ENFORCEMENT):
    1. PLATFORM FIDELITY (DO NOT DEVIATE):
       - LinkedIn: Professional yet provocative. Use terms like "POV", "Thought leadership", "Network". Structure: Bold hook -> Nuanced observation -> Bullet points for readability -> Reflective CTA.
       - Instagram: Visual and emotional. Use terms like "Link in bio", "Save for later", "Swipe". Focus on sensory words. Structure: Emotional hook -> Story/Vibe -> Brief takeaway -> Action-oriented CTA.
       - X (Twitter): Sharp, witty, and concise. High signal nuggets. Use terms like "Thread", "RT", "Unpopular opinion". Structure: Pattern interrupt hook -> Maximum impact per character -> Short punchy body -> Minimal CTA.
    2. ANTI-AI SIGNATURES: No "Let's dive in", "In conclusion", "Unlock potential", "Essential", "Crucial", or "Revolutionary". Write like a high-end ghostwriter with $1M+ in sales.
    3. NO EMOJI CLUTTER: Max 2 emojis total, and ONLY if they add actual value. Never at the start of a hook.
    4. RHYTHM: Master the "Staccato-Flow" rhythm. Short sentences for impact. Longer for detail.
    5. VISUAL DIRECTION: Match the platform style (LinkedIn: Studio/Executive, Instagram: Lifestyle/Mood, X: Brutalist/Striking).
    
    Return a JSON object:
    {
      "hook": "The scroll-stopper. Use platform-specific openings (e.g., 'Unpopular opinion:' for X, 'I realized something today...' for LinkedIn).",
      "mainContent": "The core message. MUST follow platform formats perfectly (e.g., use '1/n' for X threads if long, line breaks for LinkedIn, emotional flow for Instagram). Avoid generic blocks.",
      "cta": "The conversion spark. Platform-native (e.g., 'Retweet if...' for X, 'Thoughts?' for LinkedIn, 'Link in bio' for Instagram).",
      "hashtags": ["list of exactly ${hashtagCount} relevant hashtags"],
      "analytics": {
        "hookStrength": 0-100 score,
        "readabilityScore": 0-100 score,
        "engagementPotential": 0-100 score,
        "optimizationScore": 0-100 score
      },
      "carouselIdeas": ["5 high-impact slide ideas"],
      "visualPrompts": {
        "midjourney": "Prompt for Midjourney",
        "gemini": "Prompt for Gemini",
        "leonardo": "Prompt for Leonardo AI",
        "stableDiffusion": "Prompt for Stable Diffusion"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          mainContent: { type: Type.STRING },
          cta: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          analytics: {
            type: Type.OBJECT,
            properties: {
              hookStrength: { type: Type.NUMBER },
              readabilityScore: { type: Type.NUMBER },
              engagementPotential: { type: Type.NUMBER },
              optimizationScore: { type: Type.NUMBER }
            },
            required: ["hookStrength", "readabilityScore", "engagementPotential", "optimizationScore"]
          },
          carouselIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualPrompts: {
            type: Type.OBJECT,
            properties: {
              midjourney: { type: Type.STRING },
              gemini: { type: Type.STRING },
              leonardo: { type: Type.STRING },
              stableDiffusion: { type: Type.STRING }
            },
            required: ["midjourney", "gemini", "leonardo", "stableDiffusion"]
          }
        },
        required: ["hook", "mainContent", "cta", "hashtags", "analytics", "visualPrompts"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text) as GeneratedContent;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    // Fallback or retry logic could go here
    throw new Error("The Lumina OS engine encountered a synthesis anomaly. Please manifest again.");
  }
}
