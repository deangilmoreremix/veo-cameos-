import { GoogleGenAI } from '@google/genai';
import { supabase } from './supabaseClient';

export interface BrandGuidelines {
  id?: string;
  userId?: string;
  brandName: string;
  values: string[];
  toneOfVoice: string[];
  visualStyle: string;
  doList: string[];
  dontList: string[];
  colorPalette?: string[];
  fonts?: string;
  createdAt?: string;
  updatedAt?: string;
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

  async saveBrandGuidelines(guidelines: BrandGuidelines, userId: string): Promise<void> {
    const { data: existing } = await supabase
      .from('brand_guidelines')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const guidelinesData = {
      user_id: userId,
      brand_name: guidelines.brandName,
      values: guidelines.values,
      tone_of_voice: guidelines.toneOfVoice,
      visual_style: guidelines.visualStyle,
      do_list: guidelines.doList,
      dont_list: guidelines.dontList,
      color_palette: guidelines.colorPalette || [],
      fonts: guidelines.fonts || '',
      updated_at: new Date().toISOString()
    };

    if (existing) {
      await supabase
        .from('brand_guidelines')
        .update(guidelinesData)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('brand_guidelines')
        .insert(guidelinesData);
    }
  },

  async loadBrandGuidelines(userId: string): Promise<BrandGuidelines | null> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      brandName: data.brand_name,
      values: data.values,
      toneOfVoice: data.tone_of_voice,
      visualStyle: data.visual_style,
      doList: data.do_list,
      dontList: data.dont_list,
      colorPalette: data.color_palette,
      fonts: data.fonts,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async deleteBrandGuidelines(userId: string): Promise<void> {
    await supabase
      .from('brand_guidelines')
      .delete()
      .eq('user_id', userId);
  }
};
