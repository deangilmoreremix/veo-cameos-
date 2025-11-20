import { GoogleGenAI } from '@google/genai';

export interface CampaignConcept {
  title: string;
  description: string;
  prompt: string;
  style: string;
  targetPlatform: string;
  estimatedDuration: string;
}

export interface VideoCampaign {
  campaignName: string;
  objective: string;
  targetAudience: string;
  concepts: CampaignConcept[];
  timeline: string;
  budget: string;
  keyMetrics: string[];
}

export const campaignBuilderService = {
  async buildCampaign(businessGoal: string, productService: string, targetAudience: string): Promise<VideoCampaign> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert marketing strategist and video campaign planner.

Business Goal: "${businessGoal}"
Product/Service: "${productService}"
Target Audience: "${targetAudience}"

Create a comprehensive multi-video campaign with 5-7 complementary video concepts. Each video should serve a different purpose in the customer journey (awareness, consideration, conversion, retention).

Return your response in this exact JSON format:
{
  "campaignName": "creative campaign name",
  "objective": "main campaign objective",
  "targetAudience": "detailed audience description",
  "concepts": [
    {
      "title": "video concept title",
      "description": "what this video accomplishes in the campaign",
      "prompt": "complete Veo-ready video generation prompt",
      "style": "visual style (professional, lifestyle, dramatic, etc.)",
      "targetPlatform": "optimal platform (TikTok, YouTube, Instagram, LinkedIn)",
      "estimatedDuration": "5-10 seconds"
    }
  ],
  "timeline": "suggested campaign duration",
  "budget": "estimated video generation cost in credits",
  "keyMetrics": ["metric 1", "metric 2", "metric 3"]
}

Ensure each prompt is unique, production-ready, and aligned with the campaign strategy.`
        }]
      }],
      config: {
        temperature: 0.8,
        responseMimeType: 'application/json',
        tools: [{
          googleSearch: {}
        }]
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No campaign generated');
    }

    return JSON.parse(text);
  },

  async optimizeCampaignForPlatform(campaign: VideoCampaign, platform: string): Promise<CampaignConcept[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Optimize these video concepts specifically for ${platform}:

${JSON.stringify(campaign.concepts)}

Adjust aspect ratios, durations, and styles to match ${platform}'s best practices in 2025.

Return as JSON array of optimized concepts with the same structure.`
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
      throw new Error('Optimization failed');
    }

    return JSON.parse(text);
  }
};
