import { GoogleGenAI } from '@google/genai';

export interface PromptEnhancement {
  original: string;
  enhanced: string;
  suggestions: string[];
  confidence: number;
}

export const aiEnhancementService = {
  async enhancePrompt(userPrompt: string): Promise<PromptEnhancement> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert video prompt engineer specializing in Veo AI video generation. Your task is to enhance user prompts to create professional, cinematic video outputs.

User's original prompt: "${userPrompt}"

Enhance this prompt by adding:
1. Professional camera work details (angles, movements)
2. Lighting specifications (natural, studio, dramatic)
3. Visual composition guidance (framing, perspective)
4. Environmental details that enhance the scene
5. Style and mood descriptors

Return your response in this exact JSON format:
{
  "enhanced": "the fully enhanced prompt here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "confidence": 0.95
}

Keep the enhanced prompt under 150 words and maintain the user's core intent. Make it production-ready for Veo video generation.`
        }]
      }],
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No enhancement received from AI');
    }

    const result = JSON.parse(text);

    return {
      original: userPrompt,
      enhanced: result.enhanced,
      suggestions: result.suggestions || [],
      confidence: result.confidence || 0.8
    };
  },

  async quickEnhance(userPrompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Enhance this video generation prompt with professional camera work, lighting, and composition details. Keep it concise and under 100 words.

Original: "${userPrompt}"

Enhanced prompt:`
        }]
      }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });

    const response = await model;
    const enhanced = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return enhanced || userPrompt;
  }
};
