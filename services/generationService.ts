import { supabase } from './supabaseClient';
import { GenerateVideoParams } from '../types';

export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  resolution: string;
  mode: string;
  status: 'generating' | 'success' | 'error';
  videoUrl: string | null;
  errorMessage: string | null;
  referenceImageUrl: string | null;
  creditsUsed: number;
  createdAt: string;
  completedAt: string | null;
}

export const generationService = {
  async createGeneration(userId: string, params: GenerateVideoParams): Promise<string | null> {
    const { data, error } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        prompt: params.prompt,
        model: params.model,
        aspect_ratio: params.aspectRatio,
        resolution: params.resolution,
        mode: params.mode,
        status: 'generating',
        credits_used: 1,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating generation:', error);
      return null;
    }

    return data.id;
  },

  async updateGenerationSuccess(generationId: string, videoUrl: string): Promise<boolean> {
    const { error } = await supabase
      .from('generations')
      .update({
        status: 'success',
        video_url: videoUrl,
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId);

    if (error) {
      console.error('Error updating generation success:', error);
      return false;
    }

    return true;
  },

  async updateGenerationError(generationId: string, errorMessage: string): Promise<boolean> {
    const { error } = await supabase
      .from('generations')
      .update({
        status: 'error',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId);

    if (error) {
      console.error('Error updating generation error:', error);
      return false;
    }

    return true;
  },

  async getUserGenerations(userId: string, limit: number = 50): Promise<Generation[]> {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching generations:', error);
      return [];
    }

    return data.map(gen => ({
      id: gen.id,
      userId: gen.user_id,
      prompt: gen.prompt,
      model: gen.model,
      aspectRatio: gen.aspect_ratio,
      resolution: gen.resolution,
      mode: gen.mode,
      status: gen.status,
      videoUrl: gen.video_url,
      errorMessage: gen.error_message,
      referenceImageUrl: gen.reference_image_url,
      creditsUsed: gen.credits_used,
      createdAt: gen.created_at,
      completedAt: gen.completed_at,
    }));
  },

  async deleteGeneration(generationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', generationId);

    if (error) {
      console.error('Error deleting generation:', error);
      return false;
    }

    return true;
  },

  async getGenerationStats(userId: string): Promise<{ total: number; successful: number; failed: number }> {
    const { data, error } = await supabase
      .from('generations')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching generation stats:', error);
      return { total: 0, successful: 0, failed: 0 };
    }

    return {
      total: data.length,
      successful: data.filter(g => g.status === 'success').length,
      failed: data.filter(g => g.status === 'error').length,
    };
  },
};
