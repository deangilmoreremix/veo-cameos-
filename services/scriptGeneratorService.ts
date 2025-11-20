import { GoogleGenAI } from '@google/genai';

export interface VideoScript {
  title: string;
  scenes: SceneDescription[];
  duration: string;
  targetAudience: string;
  keyMessages: string[];
  sources: string[];
}

export interface SceneDescription {
  sceneNumber: number;
  description: string;
  duration: string;
  visualNotes: string;
  audioNotes?: string;
}

export const scriptGeneratorService = {
  async generateScript(topic: string, businessGoal: string): Promise<VideoScript> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `You are a professional video script writer specializing in marketing and business videos.

Topic: "${topic}"
Business Goal: "${businessGoal}"

Using current 2025 trends and data, create a compelling video script. Research the topic using available information to ensure the script is current and relevant.

Return your response in this exact JSON format:
{
  "title": "compelling video title",
  "scenes": [
    {
      "sceneNumber": 1,
      "description": "detailed scene description for Veo video generation",
      "duration": "5 seconds",
      "visualNotes": "camera angles, lighting, composition details",
      "audioNotes": "optional audio suggestions"
    }
  ],
  "duration": "total video length",
  "targetAudience": "who this video is for",
  "keyMessages": ["message 1", "message 2", "message 3"],
  "sources": ["relevant trend or data point 1", "relevant trend or data point 2"]
}

Create 3-5 scenes that flow naturally. Each scene description should be ready to use as a Veo video generation prompt.`
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
      throw new Error('No script generated');
    }

    const script = JSON.parse(text);
    return script;
  },

  async generateQuickScript(topic: string): Promise<SceneDescription[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Create 3 video scene descriptions for: "${topic}"

Return as JSON array:
[
  {
    "sceneNumber": 1,
    "description": "detailed Veo-ready prompt",
    "duration": "5 seconds",
    "visualNotes": "camera and lighting details"
  }
]

Make each description production-ready for video generation.`
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
      throw new Error('No scenes generated');
    }

    return JSON.parse(text);
  },

  async analyzeCompetitor(competitorUrl: string): Promise<{ insights: string[]; suggestions: string[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Analyze this competitor URL: ${competitorUrl}

Extract key insights about their video marketing approach and suggest unique alternatives.

Return as JSON:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "suggestions": ["differentiation idea 1", "differentiation idea 2", "differentiation idea 3"]
}`
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
      throw new Error('Analysis failed');
    }

    return JSON.parse(text);
  }
};
