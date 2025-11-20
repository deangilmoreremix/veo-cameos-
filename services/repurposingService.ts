import { GoogleGenAI } from '@google/genai';

export interface RepurposedVariation {
  platform: string;
  aspectRatio: string;
  duration: string;
  prompt: string;
  modifications: string[];
}

export const repurposingService = {
  async generateVariations(originalPrompt: string, platforms: string[]): Promise<RepurposedVariation[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Given this original video prompt: "${originalPrompt}"

Generate optimized variations for these platforms: ${platforms.join(', ')}

For each platform, provide:
- Optimal aspect ratio
- Recommended duration
- Modified prompt optimized for that platform's best practices (2025)
- List of modifications made

Return as JSON array:
[
  {
    "platform": "TikTok",
    "aspectRatio": "9:16",
    "duration": "15-30 seconds",
    "prompt": "optimized prompt for TikTok",
    "modifications": ["change 1", "change 2"]
  }
]

Make sure each prompt maintains the core concept but adapts to platform-specific trends and formats.`
        }]
      }],
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        tools: [{
          googleSearch: {}
        }]
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Repurposing failed');
    }

    return JSON.parse(text);
  },

  async optimizeForPlatform(prompt: string, platform: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Optimize this video prompt for ${platform} based on 2025 best practices:

Original: "${prompt}"

Return just the optimized prompt as plain text.`
        }]
      }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || prompt;
  }
};
