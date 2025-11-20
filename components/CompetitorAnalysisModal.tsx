import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Loader2, Lightbulb, TrendingUp } from 'lucide-react';
import { scriptGeneratorService } from '../services/scriptGeneratorService';

interface CompetitorAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSuggestion: (suggestion: string) => void;
}

const CompetitorAnalysisModal: React.FC<CompetitorAnalysisModalProps> = ({
  isOpen,
  onClose,
  onUseSuggestion
}) => {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [analysis, setAnalysis] = useState<{ insights: string[]; suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!competitorUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await scriptGeneratorService.analyzeCompetitor(competitorUrl);
      setAnalysis(result);
    } catch (err) {
      console.error('Competitor analysis failed:', err);
      setError('Failed to analyze competitor. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Competitive Intelligence</h2>
                    <p className="text-white/60">Analyze competitors and find unique opportunities</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {!analysis && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
                      <h3 className="text-xl font-bold text-white mb-2">Analyze Your Competition</h3>
                      <p className="text-white/70 text-sm">
                        Enter a competitor's website, video channel, or social media profile. Our AI will analyze
                        their video strategy and suggest unique angles to differentiate your content.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Competitor URL
                      </label>
                      <input
                        type="text"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        placeholder="https://competitor.com or https://youtube.com/@channel"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                      <p className="text-xs text-white/40 mt-2">
                        Works with websites, YouTube channels, TikTok profiles, and more
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleAnalyze}
                      disabled={!competitorUrl.trim() || loading}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing Competitor...
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5" />
                          Analyze Competitor
                        </>
                      )}
                    </button>
                  </div>
                )}

                {analysis && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <h3 className="text-xl font-bold text-white">Competitive Insights</h3>
                      </div>
                      <p className="text-white/70 text-sm mb-4">
                        Key patterns identified in competitor's video strategy
                      </p>
                      <ul className="space-y-3">
                        {analysis.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-3 bg-black/40 rounded-lg p-4 border border-orange-500/20">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-orange-400 text-sm font-bold">{i + 1}</span>
                            </div>
                            <span className="text-white/80 text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-green-400" />
                        <h3 className="text-xl font-bold text-white">Differentiation Opportunities</h3>
                      </div>
                      <p className="text-white/70 text-sm mb-4">
                        Unique angles and approaches to stand out from the competition
                      </p>
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, i) => (
                          <div key={i} className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                                  {i + 1}
                                </div>
                                <span className="text-white font-semibold text-sm">Opportunity #{i + 1}</span>
                              </div>
                              <button
                                onClick={() => {
                                  onUseSuggestion(suggestion);
                                  onClose();
                                }}
                                className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-xs transition-all"
                              >
                                Use This
                              </button>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                      <h4 className="text-sm font-semibold text-white/80 mb-3">💡 Pro Tips</h4>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          <span>Focus on gaps in competitor content rather than copying their approach</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          <span>Look for underserved audience segments or untapped topics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          <span>Consider alternative formats, styles, or platforms they're not using</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setAnalysis(null);
                        setCompetitorUrl('');
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                    >
                      Analyze Another Competitor
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompetitorAnalysisModal;
