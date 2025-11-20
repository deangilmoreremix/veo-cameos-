import { supabase } from './supabaseClient';

export interface PerformanceMetrics {
  id: string;
  user_id: string;
  generation_id?: string;
  prompt: string;
  character_id?: string;
  platform: string;
  predicted_score: number;
  actual_engagement?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
  quality_score: number;
  style_consistency: number;
  brand_compliance: number;
  improvements: string[];
  created_at: string;
}

class PerformanceTrackingService {
  async createPerformanceMetric(userId: string, metric: Partial<PerformanceMetrics>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert({
          user_id: userId,
          generation_id: metric.generation_id,
          prompt: metric.prompt || '',
          character_id: metric.character_id,
          platform: metric.platform || 'general',
          predicted_score: metric.predicted_score || 0,
          actual_engagement: metric.actual_engagement || {},
          quality_score: metric.quality_score || 0,
          style_consistency: metric.style_consistency || 0,
          brand_compliance: metric.brand_compliance || 0,
          improvements: metric.improvements || []
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating performance metric:', error);
      return null;
    }
  }

  async getUserPerformanceMetrics(userId: string, limit: number = 50): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  async getMetricsByCharacter(userId: string, characterId: string): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching character metrics:', error);
      return [];
    }
  }

  async getMetricsByPlatform(userId: string, platform: string): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      return [];
    }
  }

  async updateActualEngagement(metricId: string, engagement: PerformanceMetrics['actual_engagement']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('performance_metrics')
        .update({ actual_engagement: engagement })
        .eq('id', metricId);

      return !error;
    } catch (error) {
      console.error('Error updating engagement:', error);
      return false;
    }
  }

  async getTopPerformingPrompts(userId: string, limit: number = 10): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('quality_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top performing prompts:', error);
      return [];
    }
  }

  async getUserInsights(userId: string): Promise<{
    averageQuality: number;
    topPlatform: string;
    bestCharacter?: string;
    totalGenerations: number;
    improvementTrend: 'up' | 'down' | 'stable';
    recommendations: string[];
  }> {
    try {
      const metrics = await this.getUserPerformanceMetrics(userId, 100);

      if (metrics.length === 0) {
        return {
          averageQuality: 0,
          topPlatform: 'general',
          totalGenerations: 0,
          improvementTrend: 'stable',
          recommendations: ['Generate more content to see insights']
        };
      }

      const averageQuality = metrics.reduce((sum, m) => sum + m.quality_score, 0) / metrics.length;

      const platformCounts: Record<string, number> = {};
      metrics.forEach(m => {
        platformCounts[m.platform] = (platformCounts[m.platform] || 0) + 1;
      });
      const topPlatform = Object.entries(platformCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'general';

      const characterScores: Record<string, { total: number; count: number }> = {};
      metrics.forEach(m => {
        if (m.character_id) {
          if (!characterScores[m.character_id]) {
            characterScores[m.character_id] = { total: 0, count: 0 };
          }
          characterScores[m.character_id].total += m.quality_score;
          characterScores[m.character_id].count += 1;
        }
      });

      const bestCharacter = Object.entries(characterScores)
        .map(([id, scores]) => ({ id, avg: scores.total / scores.count }))
        .sort((a, b) => b.avg - a.avg)[0]?.id;

      const recentMetrics = metrics.slice(0, 10);
      const olderMetrics = metrics.slice(10, 20);
      const recentAvg = recentMetrics.reduce((sum, m) => sum + m.quality_score, 0) / recentMetrics.length;
      const olderAvg = olderMetrics.length > 0
        ? olderMetrics.reduce((sum, m) => sum + m.quality_score, 0) / olderMetrics.length
        : recentAvg;

      const improvementTrend = recentAvg > olderAvg + 5 ? 'up' : recentAvg < olderAvg - 5 ? 'down' : 'stable';

      const recommendations = [];
      if (averageQuality < 50) {
        recommendations.push('Use Script Generator for more structured prompts');
      }
      if (averageQuality < 70) {
        recommendations.push('Try applying Brand Guidelines for consistency');
      }
      if (metrics.filter(m => m.style_consistency > 80).length < metrics.length * 0.5) {
        recommendations.push('Create and reuse Style Presets for consistency');
      }
      if (improvementTrend === 'down') {
        recommendations.push('Review your top-performing prompts for patterns');
      }

      return {
        averageQuality,
        topPlatform,
        bestCharacter,
        totalGenerations: metrics.length,
        improvementTrend,
        recommendations
      };
    } catch (error) {
      console.error('Error getting user insights:', error);
      return {
        averageQuality: 0,
        topPlatform: 'general',
        totalGenerations: 0,
        improvementTrend: 'stable',
        recommendations: []
      };
    }
  }
}

export const performanceTrackingService = new PerformanceTrackingService();
