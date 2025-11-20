import { GoogleGenAI } from '@google/genai';

export interface VideoAnalysis {
  overallQuality: number;
  strengths: string[];
  improvements: string[];
  promptSuggestions: string[];
  technicalIssues: string[];
  nextSteps: string[];
}

export const videoAnalysisService = {
  async analyzeVideo(videoUrl: string, originalPrompt: string): Promise<VideoAnalysis> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();
    const videoBytes = await videoBlob.arrayBuffer();
    const base64Video = btoa(String.fromCharCode(...new Uint8Array(videoBytes)));

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'video/mp4',
              data: base64Video
            }
          },
          {
            text: `Analyze this AI-generated video that was created with the prompt: "${originalPrompt}"

Provide a comprehensive analysis including:
1. Overall quality score (0-100)
2. Strengths of the video
3. Areas for improvement
4. Specific prompt adjustments to improve future generations
5. Any technical issues detected
6. Next steps for the creator

Return as JSON:
{
  "overallQuality": 85,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "promptSuggestions": ["try adding...", "consider changing..."],
  "technicalIssues": ["issue 1 if any"],
  "nextSteps": ["action 1", "action 2"]
}`
          }
        ]
      }],
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const response = await model;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Analysis failed');
    }

    return JSON.parse(text);
  },

  async compareTwoVideos(video1Url: string, video2Url: string): Promise<{ winner: string; reasons: string[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Compare these two video URLs and determine which one is more effective for marketing purposes:

Video 1: ${video1Url}
Video 2: ${video2Url}

Return as JSON:
{
  "winner": "Video 1" or "Video 2",
  "reasons": ["reason 1", "reason 2", "reason 3"]
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
      throw new Error('Comparison failed');
    }

    return JSON.parse(text);
  }
};
