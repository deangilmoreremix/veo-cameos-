import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';
import { aiEnhancementService, PromptEnhancement } from '../services/aiEnhancementService';

interface PromptEnhancerProps {
  prompt: string;
  onApplyEnhancement: (enhancedPrompt: string) => void;
  onClose: () => void;
}

const PromptEnhancer: React.FC<PromptEnhancerProps> = ({ prompt, onApplyEnhancement, onClose }) => {
  const [enhancement, setEnhancement] = useState<PromptEnhancement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await aiEnhancementService.enhancePrompt(prompt);
      setEnhancement(result);
    } catch (err) {
      console.error('Enhancement failed:', err);
      setError('Failed to enhance prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleEnhance();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Prompt Enhancement</h3>
                <p className="text-sm text-white/60">Powered by Gemini 3.0 Pro</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/60 hover:text-white" />
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
              <p className="text-white/60 text-sm">Enhancing your prompt...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {enhancement && !loading && (
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Original</p>
                <p className="text-white/80 text-sm">{enhancement.original}</p>
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </motion.div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Enhanced</p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full">
                    <span className="text-xs text-purple-300 font-semibold">
                      {Math.round(enhancement.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed">{enhancement.enhanced}</p>
              </div>

              {enhancement.suggestions.length > 0 && (
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold">Suggestions</p>
                  <ul className="space-y-2">
                    {enhancement.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-white/60 text-sm">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onApplyEnhancement(enhancement.enhanced)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
                >
                  <Check className="w-5 h-5" />
                  Use Enhanced Prompt
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                >
                  Keep Original
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptEnhancer;
