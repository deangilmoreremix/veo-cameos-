import { GoogleGenerativeAI } from '@google/genai';

export interface ToolRecommendation {
  toolName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface PromptAnalysis {
  intent: 'business' | 'creative' | 'personal' | 'educational' | 'marketing';
  complexity: 'simple' | 'moderate' | 'complex';
  needsStructure: boolean;
  recommendations: ToolRecommendation[];
  performanceScore: number;
  suggestedImprovements: string[];
  targetPlatforms: string[];
}

class PromptAnalyzerService {
  private getApiKey(): string | null {
    if (typeof window !== 'undefined' && window.aistudio) {
      return null;
    }
    return null;
  }

  async analyzePrompt(prompt: string, context?: {
    characterId?: string;
    previousPrompts?: string[];
    brandGuidelines?: any;
  }): Promise<PromptAnalysis> {
    if (!prompt || prompt.trim().length === 0) {
      return {
        intent: 'creative',
        complexity: 'simple',
        needsStructure: true,
        recommendations: [{
          toolName: 'Script Generator',
          reason: 'Start with a structured scene to create compelling content',
          priority: 'high',
          icon: 'FileText'
        }],
        performanceScore: 0,
        suggestedImprovements: ['Add more detail to your prompt'],
        targetPlatforms: []
      };
    }

    const analysis = this.performBasicAnalysis(prompt, context);
    return analysis;
  }

  private performBasicAnalysis(prompt: string, context?: any): PromptAnalysis {
    const lowerPrompt = prompt.toLowerCase();
    const words = prompt.split(/\s+/).length;

    const businessKeywords = ['sales', 'marketing', 'product', 'brand', 'campaign', 'business', 'launch', 'promote', 'advertise'];
    const creativeKeywords = ['art', 'beautiful', 'stunning', 'creative', 'artistic', 'aesthetic'];
    const educationalKeywords = ['teach', 'learn', 'explain', 'tutorial', 'how to', 'guide'];
    const marketingKeywords = ['audience', 'engagement', 'viral', 'trending', 'conversion', 'roi'];

    const isBusinessFocused = businessKeywords.some(kw => lowerPrompt.includes(kw));
    const isCreative = creativeKeywords.some(kw => lowerPrompt.includes(kw));
    const isEducational = educationalKeywords.some(kw => lowerPrompt.includes(kw));
    const isMarketing = marketingKeywords.some(kw => lowerPrompt.includes(kw));

    let intent: PromptAnalysis['intent'] = 'creative';
    if (isBusinessFocused || isMarketing) intent = 'business';
    else if (isEducational) intent = 'educational';
    else if (isMarketing) intent = 'marketing';

    const complexity = words < 5 ? 'simple' : words < 15 ? 'moderate' : 'complex';
    const needsStructure = words < 8;

    const recommendations: ToolRecommendation[] = [];

    if (isBusinessFocused || isMarketing) {
      recommendations.push({
        toolName: 'Campaign Builder',
        reason: 'Build a complete multi-video campaign for your business goal',
        priority: 'high',
        icon: 'Target'
      });
      recommendations.push({
        toolName: 'Performance Predictor',
        reason: 'Predict how this content will perform before generating',
        priority: 'high',
        icon: 'TrendingUp'
      });
    }

    if (needsStructure || words < 10) {
      recommendations.push({
        toolName: 'Script Generator',
        reason: 'Generate a detailed scene structure for better results',
        priority: 'high',
        icon: 'FileText'
      });
    }

    if (context?.brandGuidelines) {
      recommendations.push({
        toolName: 'Brand Guidelines',
        reason: 'Ensure brand consistency with your saved guidelines',
        priority: 'medium',
        icon: 'Palette'
      });
    }

    const platformMentions = {
      'instagram': lowerPrompt.includes('instagram') || lowerPrompt.includes('insta') || lowerPrompt.includes('reel'),
      'tiktok': lowerPrompt.includes('tiktok') || lowerPrompt.includes('tik tok'),
      'youtube': lowerPrompt.includes('youtube') || lowerPrompt.includes('shorts'),
      'facebook': lowerPrompt.includes('facebook'),
      'twitter': lowerPrompt.includes('twitter') || lowerPrompt.includes('x.com')
    };

    const targetPlatforms = Object.entries(platformMentions)
      .filter(([_, mentioned]) => mentioned)
      .map(([platform]) => platform);

    if (targetPlatforms.length > 1) {
      recommendations.push({
        toolName: 'Repurposing',
        reason: 'Optimize this content for multiple platforms automatically',
        priority: 'high',
        icon: 'RefreshCw'
      });
    }

    if (lowerPrompt.includes('style') || lowerPrompt.includes('look') || lowerPrompt.includes('aesthetic')) {
      recommendations.push({
        toolName: 'Style Transfer',
        reason: 'Apply consistent style elements to your video',
        priority: 'medium',
        icon: 'Palette'
      });
    }

    if (lowerPrompt.includes('sequence') || lowerPrompt.includes('series') || lowerPrompt.includes('steps')) {
      recommendations.push({
        toolName: 'Storyboard',
        reason: 'Plan your sequence frame-by-frame for better flow',
        priority: 'medium',
        icon: 'Film'
      });
    }

    if (lowerPrompt.includes('competitor') || lowerPrompt.includes('similar to') || lowerPrompt.includes('like')) {
      recommendations.push({
        toolName: 'Competitor Analysis',
        reason: 'Analyze and differentiate from competitor content',
        priority: 'medium',
        icon: 'Target'
      });
    }

    const performanceScore = Math.min(100,
      (words > 5 ? 30 : 15) +
      (complexity === 'moderate' ? 30 : complexity === 'complex' ? 20 : 10) +
      (context?.brandGuidelines ? 20 : 0) +
      (isBusinessFocused ? 20 : 10)
    );

    const suggestedImprovements = [];
    if (words < 5) {
      suggestedImprovements.push('Add more detail about the scene, setting, and action');
    }
    if (!lowerPrompt.match(/\b(character|person|subject)\b/)) {
      suggestedImprovements.push('Specify character actions or expressions for better results');
    }
    if (!lowerPrompt.match(/\b(in|at|near|inside|outside)\b/)) {
      suggestedImprovements.push('Include location or setting details');
    }
    if (performanceScore < 50) {
      suggestedImprovements.push('Use Script Generator to create a more detailed prompt');
    }

    return {
      intent,
      complexity,
      needsStructure,
      recommendations: recommendations.slice(0, 3),
      performanceScore,
      suggestedImprovements,
      targetPlatforms
    };
  }

  async getPredictedPerformance(prompt: string, platform: string): Promise<{
    engagementScore: number;
    viralityScore: number;
    qualityScore: number;
    insights: string[];
  }> {
    const analysis = await this.analyzePrompt(prompt);

    const baseScore = analysis.performanceScore;
    const platformBonus = analysis.targetPlatforms.includes(platform) ? 10 : 0;

    return {
      engagementScore: Math.min(100, baseScore + platformBonus),
      viralityScore: Math.min(100, baseScore * 0.8 + Math.random() * 20),
      qualityScore: Math.min(100, baseScore * 0.9 + 10),
      insights: [
        analysis.complexity === 'simple' ? 'Add more detail for better engagement' : 'Good level of detail',
        analysis.needsStructure ? 'Consider using Script Generator for structure' : 'Well structured prompt',
        `Best suited for ${platform} format`
      ]
    };
  }

  getToolSuggestionForContext(context: 'pre-generation' | 'post-generation' | 'campaign-planning'): ToolRecommendation[] {
    switch (context) {
      case 'pre-generation':
        return [
          { toolName: 'Script Generator', reason: 'Start with a structured scene', priority: 'high', icon: 'FileText' },
          { toolName: 'Performance Predictor', reason: 'Preview engagement potential', priority: 'high', icon: 'TrendingUp' },
          { toolName: 'Brand Guidelines', reason: 'Apply brand consistency', priority: 'medium', icon: 'Palette' }
        ];
      case 'post-generation':
        return [
          { toolName: 'Video Analysis', reason: 'Analyze quality and performance', priority: 'high', icon: 'Search' },
          { toolName: 'Repurposing', reason: 'Adapt for other platforms', priority: 'high', icon: 'RefreshCw' },
          { toolName: 'Style Transfer', reason: 'Save style for reuse', priority: 'medium', icon: 'Palette' }
        ];
      case 'campaign-planning':
        return [
          { toolName: 'Campaign Builder', reason: 'Plan multi-video campaign', priority: 'high', icon: 'Target' },
          { toolName: 'Storyboard', reason: 'Visualize video sequence', priority: 'high', icon: 'Film' },
          { toolName: 'Competitor Analysis', reason: 'Research market positioning', priority: 'medium', icon: 'Target' }
        ];
    }
  }
}

export const promptAnalyzerService = new PromptAnalyzerService();
