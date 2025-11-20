import { GoogleGenAI } from '@google/genai';

export interface PerformancePrediction {
  confidenceScore: number;
  predictedViews: string;
  predictedEngagement: string;
  predictedConversion: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  benchmarkData: string[];
  optimalPostingTime: string;
  targetDemographics: string[];
}

export const performancePredictorService = {
  async predictPerformance(
    prompt: string,
    platform: string,
    niche: string,
    targetAudience: string
  ): Promise<PerformancePrediction> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Analyze this video concept and predict its performance:

Video Prompt: "${prompt}"
Platform: ${platform}
Niche: ${niche}
Target Audience: ${targetAudience}

Using 2025 data and trends, provide:
1. Confidence score (0-100) for predicted success
2. Predicted view range
3. Predicted engagement rate
4. Predicted conversion potential
5. Strengths of this concept
6. Potential weaknesses
7. Recommendations to improve performance
8. Relevant benchmark data from similar successful videos
9. Optimal posting time/day
10. Most responsive demographics

Return as JSON:
{
  "confidenceScore": 85,
  "predictedViews": "50K-100K",
  "predictedEngagement": "8-12%",
  "predictedConversion": "3-5%",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1 if any"],
  "recommendations": ["rec 1", "rec 2"],
  "benchmarkData": ["Similar videos in this niche average X", "data point 2"],
  "optimalPostingTime": "Tuesday-Thursday, 6-9PM EST",
  "targetDemographics": ["demo 1", "demo 2"]
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
      throw new Error('Prediction failed');
    }

    return JSON.parse(text);
  },

  async compareConcepts(
    concepts: string[],
    platform: string,
    niche: string
  ): Promise<{ rankings: Array<{ concept: string; score: number; reason: string }> }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = ai.models.generateContent({
      model: 'gemini-3.0-pro-latest',
      contents: [{
        role: 'user',
        parts: [{
          text: `Rank these video concepts by predicted performance for ${platform} in the ${niche} niche:

${concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return as JSON:
{
  "rankings": [
    {
      "concept": "full concept text",
      "score": 0-100,
      "reason": "why this ranks here"
    }
  ]
}

Order from highest to lowest predicted performance.`
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
      throw new Error('Comparison failed');
    }

    return JSON.parse(text);
  }
};
