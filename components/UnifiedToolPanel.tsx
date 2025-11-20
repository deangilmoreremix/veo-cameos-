import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, FileText, Film, Search, Palette, RefreshCw, TrendingUp, Sparkles, Clock, Star } from 'lucide-react';
import { promptAnalyzerService, ToolRecommendation } from '../services/promptAnalyzerService';

interface UnifiedToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt?: string;
  context: 'pre-generation' | 'post-generation' | 'campaign-planning';
  onToolSelect: (toolName: string) => void;
  recentTools?: string[];
  favoriteTools?: string[];
}

const toolIcons: Record<string, any> = {
  'Campaign Builder': Target,
  'Script Generator': FileText,
  'Storyboard': Film,
  'Video Analysis': Search,
  'Style Transfer': Palette,
  'Repurposing': RefreshCw,
  'Performance Predictor': TrendingUp,
  'Brand Guidelines': Palette,
  'Competitor Analysis': Target,
  'AI Tools': Sparkles
};

const toolColors: Record<string, string> = {
  'Campaign Builder': 'purple',
  'Script Generator': 'blue',
  'Storyboard': 'indigo',
  'Video Analysis': 'cyan',
  'Style Transfer': 'pink',
  'Repurposing': 'green',
  'Performance Predictor': 'orange',
  'Brand Guidelines': 'violet',
  'Competitor Analysis': 'red'
};

export const UnifiedToolPanel: React.FC<UnifiedToolPanelProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  context,
  onToolSelect,
  recentTools = [],
  favoriteTools = []
}) => {
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'recent' | 'favorites'>('recommended');

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen, currentPrompt, context]);

  const loadRecommendations = async () => {
    if (currentPrompt) {
      const analysis = await promptAnalyzerService.analyzePrompt(currentPrompt);
      setRecommendations(analysis.recommendations);
    } else {
      const contextRecommendations = promptAnalyzerService.getToolSuggestionForContext(context);
      setRecommendations(contextRecommendations);
    }
  };

  const allTools: ToolRecommendation[] = [
    { toolName: 'Campaign Builder', reason: 'Plan multi-video campaigns', priority: 'high', icon: 'Target' },
    { toolName: 'Script Generator', reason: 'Generate structured scenes', priority: 'high', icon: 'FileText' },
    { toolName: 'Storyboard', reason: 'Frame-by-frame planning', priority: 'medium', icon: 'Film' },
    { toolName: 'Video Analysis', reason: 'Quality insights', priority: 'medium', icon: 'Search' },
    { toolName: 'Style Transfer', reason: 'Extract & reuse styles', priority: 'medium', icon: 'Palette' },
    { toolName: 'Repurposing', reason: 'Multi-platform adapt', priority: 'medium', icon: 'RefreshCw' },
    { toolName: 'Performance Predictor', reason: 'Predict engagement', priority: 'high', icon: 'TrendingUp' },
    { toolName: 'Brand Guidelines', reason: 'Brand consistency', priority: 'medium', icon: 'Palette' },
    { toolName: 'Competitor Analysis', reason: 'Analyze & differentiate', priority: 'medium', icon: 'Target' }
  ];

  const getToolsForTab = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendations;
      case 'all':
        return allTools;
      case 'recent':
        return allTools.filter(t => recentTools.includes(t.toolName));
      case 'favorites':
        return allTools.filter(t => favoriteTools.includes(t.toolName));
      default:
        return recommendations;
    }
  };

  const getColorClasses = (toolName: string) => {
    const color = toolColors[toolName] || 'blue';
    return {
      bg: `bg-${color}-500/10`,
      border: `border-${color}-500/20`,
      text: `text-${color}-400`,
      hover: `hover:bg-${color}-500/20`
    };
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Tools Hub</h2>
              <p className="text-gray-400 text-sm">Enhance your workflow with intelligent tools</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recommended'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommended
              </div>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'favorites'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Favorites
              </div>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {getToolsForTab().map((tool, index) => {
                const Icon = toolIcons[tool.toolName] || Sparkles;
                const priorityColors = {
                  high: 'border-green-500/30 bg-green-500/5',
                  medium: 'border-blue-500/30 bg-blue-500/5',
                  low: 'border-gray-500/30 bg-gray-500/5'
                };

                return (
                  <motion.button
                    key={tool.toolName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onToolSelect(tool.toolName);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border ${priorityColors[tool.priority]} hover:bg-white/5 transition-all text-left group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{tool.toolName}</h3>
                        <p className="text-sm text-gray-400">{tool.reason}</p>
                        {tool.priority === 'high' && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {getToolsForTab().length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No tools in this category yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
