import { GoogleGenAI } from '@google/genai';

export interface BrandGuidelines {
  brandName: string;
  values: string[];
  toneOfVoice: string[];
  visualStyle: string;
  doList: string[];
  dontList: string[];
}

export interface ComplianceCheck {
  compliant: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  approvedPrompt?: string;
}

export const brandVoiceService = {
  async checkCompliance(prompt: string, guidelines: BrandGuidelines): Promise<ComplianceCheck> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Check if this video prompt aligns with the brand guidelines:

Prompt: "${prompt}"

Brand Guidelines:
- Brand: ${guidelines.brandName}
- Values: ${guidelines.values.join(', ')}
- Tone: ${guidelines.toneOfVoice.join(', ')}
- Visual Style: ${guidelines.visualStyle}
- Do: ${guidelines.doList.join(', ')}
- Don't: ${guidelines.dontList.join(', ')}

Return as JSON:
{
  "compliant": true/false,
  "score": 0-100,
  "issues": ["issue 1 if any"],
  "suggestions": ["how to fix issue 1"],
  "approvedPrompt": "modified prompt that complies (if original didn't comply)"
}`
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
      throw new Error('Compliance check failed');
    }

    return JSON.parse(text);
  },

  async generateBrandAlignedPrompt(concept: string, guidelines: BrandGuidelines): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Create a video prompt for: "${concept}"

That perfectly aligns with these brand guidelines:
- Brand: ${guidelines.brandName}
- Values: ${guidelines.values.join(', ')}
- Tone: ${guidelines.toneOfVoice.join(', ')}
- Visual Style: ${guidelines.visualStyle}
- Must include: ${guidelines.doList.join(', ')}
- Must avoid: ${guidelines.dontList.join(', ')}

Return just the Veo-ready prompt as plain text.`
        }]
      }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 200
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || concept;
  },

  saveBrandGuidelines(guidelines: BrandGuidelines): void {
    localStorage.setItem('brandGuidelines', JSON.stringify(guidelines));
  },

  loadBrandGuidelines(): BrandGuidelines | null {
    const saved = localStorage.getItem('brandGuidelines');
    return saved ? JSON.parse(saved) : null;
  }
};
