import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Target, TrendingUp, Loader2, Play } from 'lucide-react';
import { campaignBuilderService, VideoCampaign } from '../services/campaignBuilderService';

interface AIToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
}

type ToolTab = 'campaign' | 'predictor' | 'brand';

const AIToolsHub: React.FC<AIToolsHubProps> = ({ isOpen, onClose, onUsePrompt }) => {
  const [activeTab, setActiveTab] = useState<ToolTab>('campaign');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessGoal, setBusinessGoal] = useState('');
  const [productService, setProductService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaign, setCampaign] = useState<VideoCampaign | null>(null);

  const handleGenerateCampaign = async () => {
    if (!businessGoal.trim() || !productService.trim() || !targetAudience.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await campaignBuilderService.buildCampaign(businessGoal, productService, targetAudience);
      setCampaign(result);
    } catch (err) {
      console.error('Campaign generation failed:', err);
      setError('Failed to generate campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseConcept = (prompt: string) => {
    onUsePrompt(prompt);
    onClose();
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">AI Tools Hub</h2>
                    <p className="text-white/60">Advanced features powered by Gemini 3.0 Pro</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('campaign')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'campaign'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Campaign Builder
                </button>
                <button
                  onClick={() => setActiveTab('predictor')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'predictor'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Performance Predictor
                </button>
                <button
                  onClick={() => setActiveTab('brand')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'brand'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Brand Voice
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'campaign' && (
                  <div className="space-y-6">
                    {!campaign && (
                      <>
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">Multi-Video Campaign Builder</h3>
                          <p className="text-white/70 text-sm">
                            Analyze your business goal and automatically generate 5-7 complementary video concepts
                            that work together as a cohesive campaign across the customer journey.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">
                              Business Goal
                            </label>
                            <input
                              type="text"
                              value={businessGoal}
                              onChange={(e) => setBusinessGoal(e.target.value)}
                              placeholder="e.g., Launch new eco-friendly water bottle"
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">
                              Product/Service
                            </label>
                            <input
                              type="text"
                              value={productService}
                              onChange={(e) => setProductService(e.target.value)}
                              placeholder="e.g., Sustainable water bottles made from recycled ocean plastic"
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">
                              Target Audience
                            </label>
                            <input
                              type="text"
                              value={targetAudience}
                              onChange={(e) => setTargetAudience(e.target.value)}
                              placeholder="e.g., Environmentally conscious millennials aged 25-40"
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                          </div>

                          {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                              <p className="text-red-400 text-sm">{error}</p>
                            </div>
                          )}

                          <button
                            onClick={handleGenerateCampaign}
                            disabled={!businessGoal.trim() || !productService.trim() || !targetAudience.trim() || loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Building Campaign...
                              </>
                            ) : (
                              <>
                                <Target className="w-5 h-5" />
                                Build Campaign
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {campaign && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                          <h3 className="text-2xl font-bold text-white mb-2">{campaign.campaignName}</h3>
                          <p className="text-white/80 mb-4">{campaign.objective}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-white/50">Target Audience:</span>
                              <p className="text-white">{campaign.targetAudience}</p>
                            </div>
                            <div>
                              <span className="text-white/50">Timeline:</span>
                              <p className="text-white">{campaign.timeline}</p>
                            </div>
                            <div>
                              <span className="text-white/50">Estimated Cost:</span>
                              <p className="text-white">{campaign.budget}</p>
                            </div>
                            <div>
                              <span className="text-white/50">Videos:</span>
                              <p className="text-white">{campaign.concepts.length} concepts</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white">Video Concepts</h4>
                          {campaign.concepts.map((concept, index) => (
                            <div key={index} className="bg-black/40 rounded-xl p-5 border border-white/5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                      {index + 1}
                                    </div>
                                    <h5 className="text-white font-semibold">{concept.title}</h5>
                                  </div>
                                  <p className="text-white/70 text-sm mb-3">{concept.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-white/50">
                                    <span>Style: {concept.style}</span>
                                    <span>•</span>
                                    <span>Platform: {concept.targetPlatform}</span>
                                    <span>•</span>
                                    <span>{concept.estimatedDuration}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleUseConcept(concept.prompt)}
                                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-all whitespace-nowrap"
                                >
                                  <Play className="w-3 h-3" />
                                  Generate
                                </button>
                              </div>

                              <div className="bg-black/60 rounded-lg p-3 mt-3">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">
                                  Video Prompt
                                </p>
                                <p className="text-white/80 text-sm">{concept.prompt}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                            Key Success Metrics
                          </p>
                          <ul className="space-y-2">
                            {campaign.keyMetrics.map((metric, i) => (
                              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                <span className="text-purple-400">•</span>
                                <span>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => {
                            setCampaign(null);
                            setBusinessGoal('');
                            setProductService('');
                            setTargetAudience('');
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                        >
                          Create New Campaign
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'predictor' && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/20 text-center">
                    <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Performance Predictor</h3>
                    <p className="text-white/70 mb-4">
                      Analyze similar successful videos in your niche and predict performance metrics before generation.
                    </p>
                    <p className="text-white/50 text-sm">Coming in next update...</p>
                  </div>
                )}

                {activeTab === 'brand' && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20 text-center">
                    <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Brand Voice Checker</h3>
                    <p className="text-white/70 mb-4">
                      Ensure every video aligns with your brand guidelines, values, and messaging.
                    </p>
                    <p className="text-white/50 text-sm">Coming in next update...</p>
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

export default AIToolsHub;
