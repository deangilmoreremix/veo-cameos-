import { supabase } from './supabaseClient';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string;
  target_audience: string;
  platform: string[];
  status: 'draft' | 'in-progress' | 'completed';
  total_videos: number;
  completed_videos: number;
  concepts: CampaignConcept[];
  brand_guidelines_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CampaignConcept {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  characterId?: string;
  stylePresetId?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  generationId?: string;
  videoUrl?: string;
  performanceScore?: number;
}

class CampaignService {
  async createCampaign(userId: string, campaignData: Partial<Campaign>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: userId,
          name: campaignData.name || 'New Campaign',
          description: campaignData.description || '',
          target_audience: campaignData.target_audience || '',
          platform: campaignData.platform || [],
          status: 'draft',
          total_videos: campaignData.concepts?.length || 0,
          completed_videos: 0,
          concepts: campaignData.concepts || [],
          brand_guidelines_id: campaignData.brand_guidelines_id
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async getCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error updating campaign:', error);
      return false;
    }
  }

  async updateConceptStatus(
    campaignId: string,
    conceptId: string,
    status: CampaignConcept['status'],
    additionalData?: Partial<CampaignConcept>
  ): Promise<boolean> {
    try {
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) return false;

      const updatedConcepts = campaign.concepts.map((concept: CampaignConcept) => {
        if (concept.id === conceptId) {
          return { ...concept, status, ...additionalData };
        }
        return concept;
      });

      const completedCount = updatedConcepts.filter((c: CampaignConcept) => c.status === 'completed').length;
      const campaignStatus = completedCount === updatedConcepts.length ? 'completed' : 'in-progress';

      const { error } = await supabase
        .from('campaigns')
        .update({
          concepts: updatedConcepts,
          completed_videos: completedCount,
          status: campaignStatus,
          completed_at: campaignStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error updating concept status:', error);
      return false;
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  }

  async generateCampaignConcepts(
    businessGoal: string,
    targetAudience: string,
    platforms: string[],
    videoCount: number = 5
  ): Promise<CampaignConcept[]> {
    const concepts: CampaignConcept[] = [];

    const platformPrompts: Record<string, string[]> = {
      'instagram': [
        'Eye-catching visual hook in first 3 seconds',
        'Behind-the-scenes authentic moment',
        'User testimonial or review showcase',
        'Educational tip or hack',
        'Trending audio with brand message'
      ],
      'tiktok': [
        'Fast-paced trending format',
        'Challenge or duet opportunity',
        'Quick tutorial or how-to',
        'Relatable problem-solution',
        'Entertainment-first brand integration'
      ],
      'youtube': [
        'In-depth educational content',
        'Story-driven narrative',
        'Product demonstration',
        'Interview or Q&A format',
        'Series installment'
      ]
    };

    for (let i = 0; i < videoCount; i++) {
      const platform = platforms[i % platforms.length];
      const promptTemplates = platformPrompts[platform] || platformPrompts['instagram'];
      const template = promptTemplates[i % promptTemplates.length];

      concepts.push({
        id: `concept-${Date.now()}-${i}`,
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video ${i + 1}`,
        prompt: `${businessGoal} - ${template} for ${targetAudience}`,
        platform,
        status: 'pending'
      });
    }

    return concepts;
  }
}

export const campaignService = new CampaignService();
