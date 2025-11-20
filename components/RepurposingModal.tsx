import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Loader2, Play } from 'lucide-react';
import { repurposingService, RepurposedVariation } from '../services/repurposingService';

interface RepurposingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseVariation: (prompt: string, platform: string) => void;
  initialPrompt?: string;
}

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'from-pink-600 to-red-500' },
  { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'from-red-600 to-red-700' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'from-purple-600 to-pink-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-sky-500 to-blue-600' },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-500 to-indigo-600' },
];

const RepurposingModal: React.FC<RepurposingModalProps> = ({
  isOpen,
  onClose,
  onUseVariation,
  initialPrompt
}) => {
  const [originalPrompt, setOriginalPrompt] = useState(initialPrompt || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'youtube', 'instagram']);
  const [variations, setVariations] = useState<RepurposedVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (!originalPrompt.trim() || selectedPlatforms.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const platformNames = selectedPlatforms.map(id =>
        PLATFORMS.find(p => p.id === id)?.name || id
      );
      const result = await repurposingService.generateVariations(originalPrompt, platformNames);
      setVariations(result);
    } catch (err) {
      console.error('Repurposing failed:', err);
      setError('Failed to generate variations. Please try again.');
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
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-5xl w-full shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Video Repurposing Engine</h2>
                    <p className="text-white/60">Adapt one concept for multiple platforms</p>
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
                {variations.length === 0 && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                      <h3 className="text-xl font-bold text-white mb-2">Maximize Your Content</h3>
                      <p className="text-white/70 text-sm">
                        Transform one video concept into platform-optimized variations. Each version will be tailored
                        for specific aspect ratios, durations, and audience behaviors.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Original Video Concept
                      </label>
                      <textarea
                        value={originalPrompt}
                        onChange={(e) => setOriginalPrompt(e.target.value)}
                        placeholder="Enter your base video concept..."
                        rows={3}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-3">
                        Select Target Platforms ({selectedPlatforms.length} selected)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PLATFORMS.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => handleTogglePlatform(platform.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedPlatforms.includes(platform.id)
                                ? `bg-gradient-to-br ${platform.color} border-white/20 text-white shadow-lg`
                                : 'bg-black/40 border-white/10 text-white/60 hover:border-white/30'
                            }`}
                          >
                            <div className="text-3xl mb-2">{platform.icon}</div>
                            <div className="font-semibold text-sm">{platform.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={!originalPrompt.trim() || selectedPlatforms.length === 0 || loading}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Variations...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          Generate Platform Variations
                        </>
                      )}
                    </button>
                  </div>
                )}

                {variations.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">Platform Variations</h3>
                        <p className="text-white/60 text-sm">{variations.length} optimized versions created</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {variations.map((variation, index) => {
                        const platformData = PLATFORMS.find(p => p.name === variation.platform);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 rounded-xl p-6 border border-white/5"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformData?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-2xl`}>
                                  {platformData?.icon || '📱'}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white">{variation.platform}</h4>
                                  <div className="flex items-center gap-3 text-sm text-white/60">
                                    <span>{variation.aspectRatio}</span>
                                    <span>•</span>
                                    <span>{variation.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => onUseVariation(variation.prompt, variation.platform)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm transition-all"
                              >
                                <Play className="w-3 h-3" />
                                Generate
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-black/60 rounded-lg p-3">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">
                                  Modifications Made
                                </p>
                                <ul className="space-y-1">
                                  {variation.modifications.map((mod, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                      <span className="text-green-400">✓</span>
                                      <span>{mod}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                                <p className="text-xs text-green-300 uppercase tracking-wider font-semibold mb-2">
                                  Optimized Prompt
                                </p>
                                <p className="text-white text-sm leading-relaxed">{variation.prompt}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setVariations([]);
                        setOriginalPrompt('');
                        setSelectedPlatforms(['tiktok', 'youtube', 'instagram']);
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                    >
                      Repurpose Another Concept
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

export default RepurposingModal;
