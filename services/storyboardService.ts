import { GoogleGenAI } from '@google/genai';

export interface StoryboardFrame {
  frameNumber: number;
  timestamp: string;
  description: string;
  prompt: string;
  visualNotes: string;
  transition: string;
}

export interface Storyboard {
  title: string;
  totalDuration: string;
  frames: StoryboardFrame[];
  narrative: string;
  technicalNotes: string[];
}

export const storyboardService = {
  async generateStoryboard(concept: string, duration: number = 30): Promise<Storyboard> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const numFrames = Math.max(3, Math.min(7, Math.floor(duration / 5)));

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Create a detailed storyboard for this video concept: "${concept}"

Duration: ${duration} seconds
Number of frames: ${numFrames}

Break down the video into ${numFrames} sequential frames with smooth transitions. Each frame should have:
- Timestamp
- Scene description
- Complete Veo-ready prompt for that frame
- Visual composition notes
- Transition to next frame

Return as JSON:
{
  "title": "compelling storyboard title",
  "totalDuration": "${duration} seconds",
  "frames": [
    {
      "frameNumber": 1,
      "timestamp": "0:00-0:05",
      "description": "what happens in this frame",
      "prompt": "complete Veo prompt for this specific frame",
      "visualNotes": "camera angle, lighting, composition details",
      "transition": "fade/cut/zoom/pan to next frame"
    }
  ],
  "narrative": "overall story arc of the video",
  "technicalNotes": ["technical consideration 1", "technical consideration 2"]
}

Make each frame's prompt unique and production-ready for Veo generation.`
        }]
      }],
      config: {
        temperature: 0.8,
        responseMimeType: 'application/json'
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Storyboard generation failed');
    }

    return JSON.parse(text);
  },

  async enhanceFrame(frame: StoryboardFrame, context: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Enhance this storyboard frame prompt for better video generation:

Frame: ${frame.description}
Current prompt: "${frame.prompt}"
Context: ${context}

Return an enhanced, production-ready Veo prompt as plain text.`
        }]
      }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 150
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || frame.prompt;
  },

  async generateTransitionSuggestions(frame1: StoryboardFrame, frame2: StoryboardFrame): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Suggest 3 creative transition options between these two video frames:

Frame 1: ${frame1.description}
Frame 2: ${frame2.description}

Return as JSON array of transition descriptions:
["transition 1", "transition 2", "transition 3"]`
        }]
      }],
      config: {
        temperature: 0.8,
        responseMimeType: 'application/json'
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return ['fade', 'cut', 'dissolve'];
    }

    return JSON.parse(text);
  }
};
