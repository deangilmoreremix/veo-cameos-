import { supabase } from './supabaseClient';

export interface StylePreset {
  id: string;
  user_id: string;
  name: string;
  character_id?: string;
  style_data: {
    colorPalette?: string[];
    lighting?: string;
    mood?: string;
    cameraAngle?: string;
    composition?: string;
    visualEffects?: string[];
  };
  thumbnail_url?: string;
  is_favorite: boolean;
  usage_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

class StylePresetService {
  async createStylePreset(userId: string, preset: Partial<StylePreset>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('style_presets')
        .insert({
          user_id: userId,
          name: preset.name || 'Unnamed Style',
          character_id: preset.character_id,
          style_data: preset.style_data || {},
          thumbnail_url: preset.thumbnail_url,
          is_favorite: preset.is_favorite || false,
          usage_count: 0,
          tags: preset.tags || []
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating style preset:', error);
      return null;
    }
  }

  async getUserStylePresets(userId: string, characterId?: string): Promise<StylePreset[]> {
    try {
      let query = supabase
        .from('style_presets')
        .select('*')
        .eq('user_id', userId);

      if (characterId) {
        query = query.eq('character_id', characterId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching style presets:', error);
      return [];
    }
  }

  async getStylePreset(presetId: string): Promise<StylePreset | null> {
    try {
      const { data, error } = await supabase
        .from('style_presets')
        .select('*')
        .eq('id', presetId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching style preset:', error);
      return null;
    }
  }

  async updateStylePreset(presetId: string, updates: Partial<StylePreset>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('style_presets')
        .update(updates)
        .eq('id', presetId);

      return !error;
    } catch (error) {
      console.error('Error updating style preset:', error);
      return false;
    }
  }

  async incrementUsageCount(presetId: string): Promise<boolean> {
    try {
      const preset = await this.getStylePreset(presetId);
      if (!preset) return false;

      return await this.updateStylePreset(presetId, {
        usage_count: preset.usage_count + 1
      });
    } catch (error) {
      console.error('Error incrementing usage count:', error);
      return false;
    }
  }

  async toggleFavorite(presetId: string): Promise<boolean> {
    try {
      const preset = await this.getStylePreset(presetId);
      if (!preset) return false;

      return await this.updateStylePreset(presetId, {
        is_favorite: !preset.is_favorite
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }

  async deleteStylePreset(presetId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('style_presets')
        .delete()
        .eq('id', presetId);

      return !error;
    } catch (error) {
      console.error('Error deleting style preset:', error);
      return false;
    }
  }

  applyStyleToPrompt(basePrompt: string, styleData: StylePreset['style_data']): string {
    const styleElements = [];

    if (styleData.lighting) {
      styleElements.push(styleData.lighting);
    }
    if (styleData.mood) {
      styleElements.push(`${styleData.mood} atmosphere`);
    }
    if (styleData.cameraAngle) {
      styleElements.push(styleData.cameraAngle);
    }
    if (styleData.composition) {
      styleElements.push(styleData.composition);
    }
    if (styleData.colorPalette && styleData.colorPalette.length > 0) {
      styleElements.push(`color palette: ${styleData.colorPalette.join(', ')}`);
    }
    if (styleData.visualEffects && styleData.visualEffects.length > 0) {
      styleElements.push(styleData.visualEffects.join(', '));
    }

    if (styleElements.length === 0) {
      return basePrompt;
    }

    return `${basePrompt}, ${styleElements.join(', ')}`;
  }

  extractStyleFromPrompt(prompt: string): StylePreset['style_data'] {
    const lowerPrompt = prompt.toLowerCase();
    const styleData: StylePreset['style_data'] = {};

    const lightingKeywords = ['dramatic lighting', 'soft lighting', 'natural light', 'golden hour', 'backlit', 'moody lighting'];
    const foundLighting = lightingKeywords.find(kw => lowerPrompt.includes(kw));
    if (foundLighting) styleData.lighting = foundLighting;

    const moodKeywords = ['cinematic', 'dramatic', 'peaceful', 'energetic', 'mysterious', 'uplifting'];
    const foundMood = moodKeywords.find(kw => lowerPrompt.includes(kw));
    if (foundMood) styleData.mood = foundMood;

    const angleKeywords = ['close-up', 'wide shot', 'overhead view', 'low angle', 'high angle', 'dutch angle'];
    const foundAngle = angleKeywords.find(kw => lowerPrompt.includes(kw));
    if (foundAngle) styleData.cameraAngle = foundAngle;

    return styleData;
  }
}

export const stylePresetService = new StylePresetService();
