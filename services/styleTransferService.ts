import { GoogleGenAI } from '@google/genai';

export interface StyleAnalysis {
  colorPalette: string[];
  lighting: string;
  composition: string;
  cameraMovement: string;
  mood: string;
  pacing: string;
  promptTemplate: string;
}

export const styleTransferService = {
  async analyzeVideoStyle(videoUrl: string): Promise<StyleAnalysis> {
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
            text: `Analyze the visual style of this video in detail. Extract:
- Color palette (list of dominant colors)
- Lighting style (natural, studio, dramatic, etc.)
- Composition style (rule of thirds, centered, dynamic, etc.)
- Camera movement (static, pan, zoom, tracking, etc.)
- Overall mood (professional, casual, energetic, calm, etc.)
- Pacing (slow, medium, fast)
- A prompt template that captures this style

Return as JSON:
{
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3"],
  "lighting": "description",
  "composition": "description",
  "cameraMovement": "description",
  "mood": "description",
  "pacing": "description",
  "promptTemplate": "Veo prompt template that captures this style: [SUBJECT] with [extracted style elements]"
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
      throw new Error('Style analysis failed');
    }

    return JSON.parse(text);
  },

  async generateStyledPrompt(basePrompt: string, styleAnalysis: StyleAnalysis): Promise<string> {
    return styleAnalysis.promptTemplate.replace('[SUBJECT]', basePrompt);
  }
};
