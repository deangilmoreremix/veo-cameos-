import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Loader2, Play, Download } from 'lucide-react';
import { scriptGeneratorService, VideoScript } from '../services/scriptGeneratorService';

interface ScriptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseScene: (sceneDescription: string) => void;
}

const ScriptGeneratorModal: React.FC<ScriptGeneratorModalProps> = ({ isOpen, onClose, onUseScene }) => {
  const [topic, setTopic] = useState('');
  const [businessGoal, setBusinessGoal] = useState('');
  const [script, setScript] = useState<VideoScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !businessGoal.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await scriptGeneratorService.generateScript(topic, businessGoal);
      setScript(result);
    } catch (err) {
      console.error('Script generation failed:', err);
      setError('Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseScene = (description: string) => {
    onUseScene(description);
    onClose();
  };

  const handleDownload = () => {
    if (!script) return;

    const scriptText = `# ${script.title}

**Duration:** ${script.duration}
**Target Audience:** ${script.targetAudience}

## Key Messages
${script.keyMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}

## Scenes

${script.scenes.map(scene => `### Scene ${scene.sceneNumber} (${scene.duration})

**Description:** ${scene.description}

**Visual Notes:** ${scene.visualNotes}

${scene.audioNotes ? `**Audio Notes:** ${scene.audioNotes}` : ''}

---
`).join('\n')}

## Sources & Trends
${script.sources.map((src, i) => `- ${src}`).join('\n')}
`;

    const blob = new Blob([scriptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
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
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Smart Script Generator</h2>
                    <p className="text-white/60">Powered by Gemini 3.0 Pro with Google Search</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              {!script && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Video Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Sustainable fashion trends, AI in healthcare, etc."
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Business Goal
                    </label>
                    <input
                      type="text"
                      value={businessGoal}
                      onChange={(e) => setBusinessGoal(e.target.value)}
                      placeholder="e.g., Launch campaign, educate customers, build brand awareness"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || !businessGoal.trim() || loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Script...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Generate Script
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {script && (
                <div className="flex-1 overflow-y-auto space-y-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-2xl font-bold text-white mb-2">{script.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                      <span>Duration: {script.duration}</span>
                      <span>•</span>
                      <span>{script.targetAudience}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Key Messages</p>
                      {script.keyMessages.map((msg, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/80">
                          <span className="text-blue-400">{i + 1}.</span>
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-white">Scenes</h4>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download Script
                      </button>
                    </div>

                    {script.scenes.map((scene) => (
                      <div key={scene.sceneNumber} className="bg-black/40 rounded-xl p-5 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                              {scene.sceneNumber}
                            </div>
                            <span className="text-xs text-white/60">{scene.duration}</span>
                          </div>
                          <button
                            onClick={() => handleUseScene(scene.description)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm transition-all"
                          >
                            <Play className="w-3 h-3" />
                            Use Scene
                          </button>
                        </div>

                        <p className="text-white mb-3 text-sm leading-relaxed">{scene.description}</p>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-white/40 uppercase tracking-wider font-semibold">Visual:</span>
                            <p className="text-white/70 mt-1">{scene.visualNotes}</p>
                          </div>
                          {scene.audioNotes && (
                            <div>
                              <span className="text-white/40 uppercase tracking-wider font-semibold">Audio:</span>
                              <p className="text-white/70 mt-1">{scene.audioNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {script.sources.length > 0 && (
                    <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                        Research & Trends (2025)
                      </p>
                      <ul className="space-y-2">
                        {script.sources.map((source, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                            <span className="text-cyan-400">•</span>
                            <span>{source}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setScript(null);
                      setTopic('');
                      setBusinessGoal('');
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                  >
                    Generate New Script
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ScriptGeneratorModal;
