import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Award, Target, Zap } from 'lucide-react';
import { performanceTrackingService } from '../services/performanceTrackingService';

interface PerformanceInsightsPanelProps {
  userId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const PerformanceInsightsPanel: React.FC<PerformanceInsightsPanelProps> = ({
  userId,
  isVisible,
  onClose
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible && userId) {
      loadInsights();
    }
  }, [isVisible, userId]);

  const loadInsights = async () => {
    setLoading(true);
    const data = await performanceTrackingService.getUserInsights(userId);
    setInsights(data);
    setLoading(false);
  };

  if (!isVisible) return null;

  const getTrendIcon = () => {
    if (!insights) return Minus;
    switch (insights.improvementTrend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = () => {
    if (!insights) return 'text-gray-400';
    switch (insights.improvementTrend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const TrendIcon = getTrendIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Performance Insights</h3>
            <p className="text-xs text-gray-400">Your generation analytics</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Hide
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading insights...</div>
      ) : insights ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Quality Score</span>
              </div>
              <div className={`text-2xl font-bold ${getQualityColor(insights.averageQuality)}`}>
                {Math.round(insights.averageQuality)}%
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Total Videos</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {insights.totalGenerations}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendIcon className={`w-4 h-4 ${getTrendColor()}`} />
                <span className="text-xs text-gray-400">Trend</span>
              </div>
              <div className={`text-2xl font-bold ${getTrendColor()} capitalize`}>
                {insights.improvementTrend}
              </div>
            </div>
          </div>

          {insights.topPlatform && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Top Platform</span>
              </div>
              <div className="text-lg font-bold text-purple-400 capitalize">
                {insights.topPlatform}
              </div>
            </div>
          )}

          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {insights.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">No insights available</div>
      )}
    </motion.div>
  );
};
