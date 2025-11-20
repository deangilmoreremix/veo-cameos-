import React, { useState, useEffect } from 'react';
import { X, Plus, Target, Play, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { campaignService, Campaign, CampaignConcept } from '../services/campaignService';

interface CampaignBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onGenerateConcept: (concept: CampaignConcept) => void;
}

export const CampaignBuilderModal: React.FC<CampaignBuilderModalProps> = ({
  isOpen,
  onClose,
  userId,
  onGenerateConcept
}) => {
  const [step, setStep] = useState<'setup' | 'concepts' | 'progress'>('setup');
  const [campaignName, setCampaignName] = useState('');
  const [businessGoal, setBusinessGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [videoCount, setVideoCount] = useState(5);
  const [concepts, setConcepts] = useState<CampaignConcept[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'facebook', name: 'Facebook', icon: '👍' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep('setup');
      setCampaignName('');
      setBusinessGoal('');
      setTargetAudience('');
      setSelectedPlatforms(['instagram']);
      setVideoCount(5);
      setConcepts([]);
      setCurrentCampaign(null);
    }
  }, [isOpen]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerateConcepts = async () => {
    if (!businessGoal || !targetAudience || selectedPlatforms.length === 0) {
      return;
    }

    setLoading(true);
    const generatedConcepts = await campaignService.generateCampaignConcepts(
      businessGoal,
      targetAudience,
      selectedPlatforms,
      videoCount
    );
    setConcepts(generatedConcepts);
    setLoading(false);
    setStep('concepts');
  };

  const handleSaveCampaign = async () => {
    if (!userId) return;

    setLoading(true);
    const campaignId = await campaignService.createCampaign(userId, {
      name: campaignName || `${businessGoal} Campaign`,
      description: `Campaign for ${targetAudience}`,
      target_audience: targetAudience,
      platform: selectedPlatforms,
      concepts: concepts,
      status: 'draft'
    });

    if (campaignId) {
      const campaign = await campaignService.getCampaign(campaignId);
      setCurrentCampaign(campaign);
      setStep('progress');
    }
    setLoading(false);
  };

  const handleGenerateConcept = (concept: CampaignConcept) => {
    onGenerateConcept(concept);
    if (currentCampaign) {
      campaignService.updateConceptStatus(currentCampaign.id, concept.id, 'generating');
    }
  };

  const handleEditConcept = (conceptId: string, newPrompt: string) => {
    setConcepts(prev =>
      prev.map(c => c.id === conceptId ? { ...c, prompt: newPrompt } : c)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative border border-white/10"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Campaign Builder</h2>
              <p className="text-gray-400 text-sm">Create multi-video campaigns for your business</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <div className={`flex-1 h-1 rounded ${step === 'setup' || step === 'concepts' || step === 'progress' ? 'bg-purple-500' : 'bg-gray-700'}`} />
            <div className={`flex-1 h-1 rounded ${step === 'concepts' || step === 'progress' ? 'bg-purple-500' : 'bg-gray-700'}`} />
            <div className={`flex-1 h-1 rounded ${step === 'progress' ? 'bg-purple-500' : 'bg-gray-700'}`} />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <AnimatePresence mode="wait">
            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Name (Optional)</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="My Awesome Campaign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Goal</label>
                  <input
                    type="text"
                    value={businessGoal}
                    onChange={(e) => setBusinessGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Launch new product, increase brand awareness, drive sales..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Tech enthusiasts, small business owners, millennials..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Platforms</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{platform.icon}</div>
                        <div className="text-sm font-medium">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Videos: {videoCount}</label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={videoCount}
                    onChange={(e) => setVideoCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3</span>
                    <span>20</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateConcepts}
                  disabled={!businessGoal || !targetAudience || selectedPlatforms.length === 0 || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Campaign Concepts'}
                </button>
              </motion.div>
            )}

            {step === 'concepts' && (
              <motion.div
                key="concepts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">Review Campaign Concepts</h3>
                  <p className="text-sm text-gray-400">Edit prompts or proceed to save and start generating</p>
                </div>

                <div className="space-y-3">
                  {concepts.map((concept, index) => (
                    <div key={concept.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">
                          {concept.platform}
                        </span>
                        <span className="text-sm font-medium text-gray-400">Video {index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={concept.prompt}
                        onChange={(e) => handleEditConcept(concept.id, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('setup')}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveCampaign}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save & Start Campaign'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'progress' && currentCampaign && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">{currentCampaign.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{currentCampaign.completed_videos} / {currentCampaign.total_videos} completed</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                        style={{ width: `${(currentCampaign.completed_videos / currentCampaign.total_videos) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {concepts.map((concept, index) => (
                    <div key={concept.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">
                            {concept.platform}
                          </span>
                          <span className="text-sm font-medium">Video {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {concept.status === 'pending' && (
                            <button
                              onClick={() => handleGenerateConcept(concept)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Generate
                            </button>
                          )}
                          {concept.status === 'generating' && (
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg flex items-center gap-1">
                              <Loader className="w-3 h-3 animate-spin" />
                              Generating...
                            </span>
                          )}
                          {concept.status === 'completed' && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Complete
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{concept.prompt}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
