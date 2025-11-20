import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Loader2, Play, Download } from 'lucide-react';
import { storyboardService, Storyboard } from '../services/storyboardService';

interface StoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseFrame: (framePrompt: string) => void;
}

const StoryboardModal: React.FC<StoryboardModalProps> = ({ isOpen, onClose, onUseFrame }) => {
  const [concept, setConcept] = useState('');
  const [duration, setDuration] = useState(30);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!concept.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await storyboardService.generateStoryboard(concept, duration);
      setStoryboard(result);
    } catch (err) {
      console.error('Storyboard generation failed:', err);
      setError('Failed to generate storyboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!storyboard) return;

    const storyboardText = `# ${storyboard.title}

**Total Duration:** ${storyboard.totalDuration}

## Narrative
${storyboard.narrative}

## Frames

${storyboard.frames.map(frame => `### Frame ${frame.frameNumber} (${frame.timestamp})

**Description:** ${frame.description}

**Prompt:**
${frame.prompt}

**Visual Notes:** ${frame.visualNotes}

**Transition:** ${frame.transition}

---
`).join('\n')}

## Technical Notes
${storyboard.technicalNotes.map(note => `- ${note}`).join('\n')}
`;

    const blob = new Blob([storyboardText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-${storyboard.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Dynamic Storyboard Generator</h2>
                    <p className="text-white/60">Break down complex videos into sequential frames</p>
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
                {!storyboard && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
                      <h3 className="text-xl font-bold text-white mb-2">Create Visual Storyboard</h3>
                      <p className="text-white/70 text-sm">
                        Transform your video concept into a detailed frame-by-frame storyboard with timing,
                        transitions, and production-ready prompts.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Video Concept
                      </label>
                      <textarea
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Describe your video idea in detail..."
                        rows={4}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Target Duration: {duration} seconds
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="60"
                        step="5"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-white/40 mt-1">
                        <span>15s</span>
                        <span>30s</span>
                        <span>60s</span>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={!concept.trim() || loading}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Storyboard...
                        </>
                      ) : (
                        <>
                          <Film className="w-5 h-5" />
                          Generate Storyboard
                        </>
                      )}
                    </button>
                  </div>
                )}

                {storyboard && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{storyboard.title}</h3>
                          <p className="text-white/60 text-sm">Duration: {storyboard.totalDuration}</p>
                        </div>
                        <button
                          onClick={handleDownload}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                      <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                        <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Narrative</p>
                        <p className="text-white/80 text-sm">{storyboard.narrative}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Frames ({storyboard.frames.length})</h4>

                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />

                        <div className="space-y-6">
                          {storyboard.frames.map((frame, index) => (
                            <motion.div
                              key={frame.frameNumber}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-14"
                            >
                              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-4 border-neutral-900">
                                {frame.frameNumber}
                              </div>

                              <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-indigo-400 font-semibold text-sm">{frame.timestamp}</span>
                                      <span className="text-white/30">•</span>
                                      <span className="text-white/60 text-sm">{frame.transition}</span>
                                    </div>
                                    <p className="text-white font-medium mb-3">{frame.description}</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      onUseFrame(frame.prompt);
                                      onClose();
                                    }}
                                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm transition-all whitespace-nowrap"
                                  >
                                    <Play className="w-3 h-3" />
                                    Generate
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  <div className="bg-black/60 rounded-lg p-3">
                                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">
                                      Visual Notes
                                    </p>
                                    <p className="text-white/70 text-sm">{frame.visualNotes}</p>
                                  </div>

                                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-500/20">
                                    <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-2">
                                      Veo Prompt
                                    </p>
                                    <p className="text-white text-sm leading-relaxed">{frame.prompt}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {storyboard.technicalNotes.length > 0 && (
                      <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                        <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                          Technical Notes
                        </p>
                        <ul className="space-y-2">
                          {storyboard.technicalNotes.map((note, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                              <span className="text-indigo-400">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setStoryboard(null);
                        setConcept('');
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                    >
                      Create New Storyboard
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

export default StoryboardModal;
