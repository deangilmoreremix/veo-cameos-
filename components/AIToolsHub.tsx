import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Target, TrendingUp, Loader2, Play, Save, CheckCircle } from 'lucide-react';
import { campaignBuilderService, VideoCampaign } from '../services/campaignBuilderService';
import { performancePredictorService, PerformancePrediction } from '../services/performancePredictorService';
import { brandVoiceService, BrandGuidelines, ComplianceCheck } from '../services/brandVoiceService';

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

  const [promptToPredict, setPromptToPredict] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [niche, setNiche] = useState('');
  const [prediction, setPrediction] = useState<PerformancePrediction | null>(null);

  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuidelines | null>(null);
  const [promptToCheck, setPromptToCheck] = useState('');
  const [compliance, setCompliance] = useState<ComplianceCheck | null>(null);
  const [showGuidelinesForm, setShowGuidelinesForm] = useState(false);

  useEffect(() => {
    const saved = brandVoiceService.loadBrandGuidelines();
    if (saved) {
      setBrandGuidelines(saved);
    }
  }, []);

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
                  <div className="space-y-6">
                    {!prediction && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">Performance Predictor</h3>
                          <p className="text-white/70 text-sm">
                            Predict video performance before generation using 2025 data and trends.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Video Concept</label>
                          <textarea
                            value={promptToPredict}
                            onChange={(e) => setPromptToPredict(e.target.value)}
                            placeholder="Describe your video concept..."
                            rows={3}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Platform</label>
                            <select
                              value={platform}
                              onChange={(e) => setPlatform(e.target.value)}
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                            >
                              <option>TikTok</option>
                              <option>YouTube</option>
                              <option>Instagram</option>
                              <option>LinkedIn</option>
                              <option>Twitter/X</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Niche</label>
                            <input
                              type="text"
                              value={niche}
                              onChange={(e) => setNiche(e.target.value)}
                              placeholder="e.g., B2B SaaS, Fitness, Fashion"
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            if (!promptToPredict.trim() || !niche.trim()) return;
                            setLoading(true);
                            setError(null);
                            try {
                              const result = await performancePredictorService.predictPerformance(
                                promptToPredict,
                                platform,
                                niche,
                                targetAudience || 'general audience'
                              );
                              setPrediction(result);
                            } catch (err) {
                              setError('Failed to predict performance');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={!promptToPredict.trim() || !niche.trim() || loading}
                          className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Predicting...
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-5 h-5" />
                              Predict Performance
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {prediction && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Performance Forecast</h3>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-400">{prediction.confidenceScore}%</div>
                              <p className="text-xs text-white/60">Confidence</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-black/40 rounded-lg p-3">
                              <p className="text-2xl font-bold text-white">{prediction.predictedViews}</p>
                              <p className="text-xs text-white/60 mt-1">Views</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                              <p className="text-2xl font-bold text-white">{prediction.predictedEngagement}</p>
                              <p className="text-xs text-white/60 mt-1">Engagement</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                              <p className="text-2xl font-bold text-white">{prediction.predictedConversion}</p>
                              <p className="text-xs text-white/60 mt-1">Conversion</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-black/40 rounded-xl p-5 border border-green-500/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Strengths</h4>
                            <ul className="space-y-2">
                              {prediction.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-black/40 rounded-xl p-5 border border-yellow-500/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Weaknesses</h4>
                            <ul className="space-y-2">
                              {prediction.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                  <span className="text-yellow-400 shrink-0">!</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                          <h4 className="text-sm font-semibold text-white/80 mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {prediction.recommendations.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                <span className="text-blue-400 font-bold">{i + 1}.</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                          <h4 className="text-sm font-semibold text-white/80 mb-3">Optimal Posting</h4>
                          <p className="text-white">{prediction.optimalPostingTime}</p>
                        </div>

                        <button
                          onClick={() => {
                            setPrediction(null);
                            setPromptToPredict('');
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                        >
                          Predict Another
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'brand' && (
                  <div className="space-y-6">
                    {!brandGuidelines || showGuidelinesForm ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">Brand Voice Checker</h3>
                          <p className="text-white/70 text-sm">
                            {brandGuidelines ? 'Update your brand guidelines' : 'Set up your brand guidelines to ensure consistency'}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Brand Name</label>
                          <input
                            type="text"
                            defaultValue={brandGuidelines?.brandName || ''}
                            id="brandName"
                            placeholder="Your brand name"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Core Values (comma-separated)</label>
                          <input
                            type="text"
                            defaultValue={brandGuidelines?.values.join(', ') || ''}
                            id="values"
                            placeholder="innovation, sustainability, quality"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Tone of Voice (comma-separated)</label>
                          <input
                            type="text"
                            defaultValue={brandGuidelines?.toneOfVoice.join(', ') || ''}
                            id="toneOfVoice"
                            placeholder="professional, friendly, inspiring"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Visual Style</label>
                          <textarea
                            defaultValue={brandGuidelines?.visualStyle || ''}
                            id="visualStyle"
                            placeholder="Clean and modern, bright colors, natural lighting..."
                            rows={2}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Do's (comma-separated)</label>
                          <input
                            type="text"
                            defaultValue={brandGuidelines?.doList.join(', ') || ''}
                            id="doList"
                            placeholder="show diversity, use natural settings, include product shots"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">Don'ts (comma-separated)</label>
                          <input
                            type="text"
                            defaultValue={brandGuidelines?.dontList.join(', ') || ''}
                            id="dontList"
                            placeholder="avoid dark themes, no competitor mentions, no controversial topics"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const guidelines: BrandGuidelines = {
                              brandName: (document.getElementById('brandName') as HTMLInputElement).value,
                              values: (document.getElementById('values') as HTMLInputElement).value.split(',').map(v => v.trim()),
                              toneOfVoice: (document.getElementById('toneOfVoice') as HTMLInputElement).value.split(',').map(v => v.trim()),
                              visualStyle: (document.getElementById('visualStyle') as HTMLTextAreaElement).value,
                              doList: (document.getElementById('doList') as HTMLInputElement).value.split(',').map(v => v.trim()),
                              dontList: (document.getElementById('dontList') as HTMLInputElement).value.split(',').map(v => v.trim())
                            };
                            brandVoiceService.saveBrandGuidelines(guidelines);
                            setBrandGuidelines(guidelines);
                            setShowGuidelinesForm(false);
                          }}
                          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Save className="w-5 h-5" />
                          Save Brand Guidelines
                        </button>

                        {brandGuidelines && (
                          <button
                            onClick={() => setShowGuidelinesForm(false)}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {!compliance ? (
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-1">{brandGuidelines.brandName}</h3>
                                  <p className="text-white/60 text-sm">Brand guidelines active</p>
                                </div>
                                <button
                                  onClick={() => setShowGuidelinesForm(true)}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all"
                                >
                                  Edit
                                </button>
                              </div>
                              <div className="grid md:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-white/50">Values:</span>
                                  <p className="text-white">{brandGuidelines.values.join(', ')}</p>
                                </div>
                                <div>
                                  <span className="text-white/50">Tone:</span>
                                  <p className="text-white">{brandGuidelines.toneOfVoice.join(', ')}</p>
                                </div>
                                <div>
                                  <span className="text-white/50">Style:</span>
                                  <p className="text-white">{brandGuidelines.visualStyle}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-white/80 mb-2">Check Prompt Compliance</label>
                              <textarea
                                value={promptToCheck}
                                onChange={(e) => setPromptToCheck(e.target.value)}
                                placeholder="Enter your video prompt to check against brand guidelines..."
                                rows={3}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                              />
                            </div>

                            <button
                              onClick={async () => {
                                if (!promptToCheck.trim()) return;
                                setLoading(true);
                                setError(null);
                                try {
                                  const result = await brandVoiceService.checkCompliance(promptToCheck, brandGuidelines);
                                  setCompliance(result);
                                } catch (err) {
                                  setError('Failed to check compliance');
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={!promptToCheck.trim() || loading}
                              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Check Compliance
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className={`rounded-xl p-6 border ${compliance.compliant ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-white">
                                  {compliance.compliant ? '✓ Brand Compliant' : '⚠️ Needs Adjustment'}
                                </h3>
                                <div className={`text-3xl font-bold ${compliance.compliant ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {compliance.score}/100
                                </div>
                              </div>
                            </div>

                            {compliance.issues.length > 0 && (
                              <div className="bg-black/40 rounded-xl p-5 border border-yellow-500/20">
                                <h4 className="text-sm font-semibold text-white/80 mb-3">Issues Found</h4>
                                <ul className="space-y-2">
                                  {compliance.issues.map((issue, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                      <span className="text-yellow-400">!</span>
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {compliance.suggestions.length > 0 && (
                              <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                                <h4 className="text-sm font-semibold text-white/80 mb-3">Suggestions</h4>
                                <ul className="space-y-2">
                                  {compliance.suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                      <span className="text-green-400">→</span>
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {compliance.approvedPrompt && (
                              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-500/20">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-semibold text-white/80">Brand-Aligned Version</h4>
                                  <button
                                    onClick={() => {
                                      onUsePrompt(compliance.approvedPrompt!);
                                      onClose();
                                    }}
                                    className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm transition-all"
                                  >
                                    Use This
                                  </button>
                                </div>
                                <p className="text-white text-sm leading-relaxed">{compliance.approvedPrompt}</p>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setCompliance(null);
                                setPromptToCheck('');
                              }}
                              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                            >
                              Check Another Prompt
                            </button>
                          </div>
                        )}
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

export default AIToolsHub;
