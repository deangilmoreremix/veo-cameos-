import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { videoAnalysisService, VideoAnalysis } from '../services/videoAnalysisService';

interface VideoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  originalPrompt?: string;
}

const VideoAnalysisModal: React.FC<VideoAnalysisModalProps> = ({
  isOpen,
  onClose,
  videoUrl: initialVideoUrl,
  originalPrompt: initialPrompt
}) => {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl || '');
  const [originalPrompt, setOriginalPrompt] = useState(initialPrompt || '');
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!videoUrl.trim() || !originalPrompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await videoAnalysisService.analyzeVideo(videoUrl, originalPrompt);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze video. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Video Analysis</h2>
                    <p className="text-white/60">AI-powered quality assessment and improvement suggestions</p>
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
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                      <h3 className="text-xl font-bold text-white mb-2">Analyze Your Video</h3>
                      <p className="text-white/70 text-sm">
                        Get detailed insights about video quality, strengths, weaknesses, and actionable improvements.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Video URL
                      </label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4 or blob:..."
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Original Prompt Used
                      </label>
                      <textarea
                        value={originalPrompt}
                        onChange={(e) => setOriginalPrompt(e.target.value)}
                        placeholder="The prompt you used to generate this video..."
                        rows={3}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleAnalyze}
                      disabled={!videoUrl.trim() || !originalPrompt.trim() || loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing Video...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Analyze Video
                        </>
                      )}
                    </button>
                  </div>
                )}

                {analysis && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Overall Quality</h3>
                          <p className="text-white/60 text-sm">Based on AI analysis</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-5xl font-bold ${getQualityColor(analysis.overallQuality)}`}>
                            {analysis.overallQuality}
                          </div>
                          <p className={`text-sm font-semibold ${getQualityColor(analysis.overallQuality)}`}>
                            {getQualityLabel(analysis.overallQuality)}
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.overallQuality}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-black/40 rounded-xl p-5 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <h4 className="text-lg font-bold text-white">Strengths</h4>
                        </div>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-black/40 rounded-xl p-5 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <h4 className="text-lg font-bold text-white">Areas for Improvement</h4>
                        </div>
                        <ul className="space-y-2">
                          {analysis.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                              <span className="text-yellow-400 mt-0.5">!</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-purple-400" />
                        <h4 className="text-lg font-bold text-white">Prompt Suggestions</h4>
                      </div>
                      <p className="text-white/60 text-sm mb-3">
                        Try these modifications to improve your next generation:
                      </p>
                      <ul className="space-y-3">
                        {analysis.promptSuggestions.map((suggestion, i) => (
                          <li key={i} className="bg-black/40 rounded-lg p-3 text-white/80 text-sm border border-purple-500/20">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analysis.technicalIssues.length > 0 && (
                      <div className="bg-black/40 rounded-xl p-5 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h4 className="text-lg font-bold text-white">Technical Issues Detected</h4>
                        </div>
                        <ul className="space-y-2">
                          {analysis.technicalIssues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                              <span className="text-red-400 mt-0.5">×</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <h4 className="text-lg font-bold text-white">Next Steps</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysis.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                            <span className="text-cyan-400 font-bold">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setAnalysis(null);
                        setVideoUrl('');
                        setOriginalPrompt('');
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                    >
                      Analyze Another Video
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

export default VideoAnalysisModal;
