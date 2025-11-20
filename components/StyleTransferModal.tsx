import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Loader2, Save, Wand2 } from 'lucide-react';
import { styleTransferService, StyleAnalysis } from '../services/styleTransferService';

interface StyleTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseStyle: (styledPrompt: string) => void;
}

interface SavedStyle extends StyleAnalysis {
  id: string;
  name: string;
  thumbnailUrl: string;
  savedAt: number;
}

const StyleTransferModal: React.FC<StyleTransferModalProps> = ({ isOpen, onClose, onUseStyle }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null);
  const [basePrompt, setBasePrompt] = useState('');
  const [styledPrompt, setStyledPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>(() => {
    const saved = localStorage.getItem('savedStyles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLibrary, setShowLibrary] = useState(false);

  const handleAnalyzeStyle = async () => {
    if (!videoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const analysis = await styleTransferService.analyzeVideoStyle(videoUrl);
      setStyleAnalysis(analysis);
    } catch (err) {
      console.error('Style analysis failed:', err);
      setError('Failed to analyze video style. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStyled = async () => {
    if (!styleAnalysis || !basePrompt.trim()) return;

    const generated = await styleTransferService.generateStyledPrompt(basePrompt, styleAnalysis);
    setStyledPrompt(generated);
  };

  const handleSaveStyle = () => {
    if (!styleAnalysis) return;

    const styleName = prompt('Give this style a name:');
    if (!styleName) return;

    const newStyle: SavedStyle = {
      ...styleAnalysis,
      id: Date.now().toString(),
      name: styleName,
      thumbnailUrl: videoUrl,
      savedAt: Date.now()
    };

    const updated = [...savedStyles, newStyle];
    setSavedStyles(updated);
    localStorage.setItem('savedStyles', JSON.stringify(updated));
  };

  const handleLoadStyle = (style: SavedStyle) => {
    setStyleAnalysis(style);
    setShowLibrary(false);
  };

  const handleDeleteStyle = (id: string) => {
    const updated = savedStyles.filter(s => s.id !== id);
    setSavedStyles(updated);
    localStorage.setItem('savedStyles', JSON.stringify(updated));
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Style Transfer Library</h2>
                    <p className="text-white/60">Extract and reuse visual styles from any video</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setShowLibrary(false)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    !showLibrary
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Extract Style
                </button>
                <button
                  onClick={() => setShowLibrary(true)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    showLibrary
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  My Styles ({savedStyles.length})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {!showLibrary ? (
                  <>
                    {!styleAnalysis && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl p-6 border border-pink-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">Extract Visual Style</h3>
                          <p className="text-white/70 text-sm">
                            Analyze any video to extract its color palette, lighting, composition, and camera work.
                            Then apply that style to your new videos.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">
                            Video URL to Analyze
                          </label>
                          <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://example.com/video.mp4 or blob:..."
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 transition-colors"
                          />
                        </div>

                        {error && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                          </div>
                        )}

                        <button
                          onClick={handleAnalyzeStyle}
                          disabled={!videoUrl.trim() || loading}
                          className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Analyzing Style...
                            </>
                          ) : (
                            <>
                              <Palette className="w-5 h-5" />
                              Extract Style
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {styleAnalysis && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">Extracted Style</h3>
                          <button
                            onClick={handleSaveStyle}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all"
                          >
                            <Save className="w-4 h-4" />
                            Save to Library
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Color Palette</h4>
                            <div className="flex flex-wrap gap-2">
                              {styleAnalysis.colorPalette.map((color, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div
                                    className="w-12 h-12 rounded-lg border border-white/20"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-xs text-white/60 font-mono">{color}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Style Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-white/50">Lighting:</span>
                                <p className="text-white">{styleAnalysis.lighting}</p>
                              </div>
                              <div>
                                <span className="text-white/50">Composition:</span>
                                <p className="text-white">{styleAnalysis.composition}</p>
                              </div>
                              <div>
                                <span className="text-white/50">Camera:</span>
                                <p className="text-white">{styleAnalysis.cameraMovement}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Mood</h4>
                            <p className="text-white">{styleAnalysis.mood}</p>
                          </div>

                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Pacing</h4>
                            <p className="text-white">{styleAnalysis.pacing}</p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl p-5 border border-pink-500/20">
                          <h4 className="text-sm font-semibold text-white/80 mb-3">Apply Style to New Video</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={basePrompt}
                              onChange={(e) => setBasePrompt(e.target.value)}
                              placeholder="Enter your base video concept..."
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 transition-colors"
                            />
                            <button
                              onClick={handleGenerateStyled}
                              disabled={!basePrompt.trim()}
                              className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <Wand2 className="w-5 h-5" />
                              Generate Styled Prompt
                            </button>
                          </div>
                        </div>

                        {styledPrompt && (
                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-white/80">Styled Prompt</h4>
                              <button
                                onClick={() => {
                                  onUseStyle(styledPrompt);
                                  onClose();
                                }}
                                className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-300 text-sm transition-all"
                              >
                                Use This Prompt
                              </button>
                            </div>
                            <p className="text-white leading-relaxed">{styledPrompt}</p>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setStyleAnalysis(null);
                            setVideoUrl('');
                            setBasePrompt('');
                            setStyledPrompt('');
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                        >
                          Extract Another Style
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    {savedStyles.length === 0 ? (
                      <div className="text-center py-12">
                        <Palette className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Saved Styles Yet</h3>
                        <p className="text-white/60 mb-4">Extract and save your first style to build your library</p>
                        <button
                          onClick={() => setShowLibrary(false)}
                          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl text-white font-semibold"
                        >
                          Extract Style
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {savedStyles.map((style) => (
                          <div key={style.id} className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-lg font-bold text-white">{style.name}</h4>
                              <button
                                onClick={() => handleDeleteStyle(style.id)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <div className="flex gap-2 mb-3">
                              {style.colorPalette.slice(0, 5).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <p className="text-white/60 text-sm mb-3">{style.mood}</p>
                            <button
                              onClick={() => handleLoadStyle(style)}
                              className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-300 text-sm transition-all"
                            >
                              Use This Style
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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

export default StyleTransferModal;
