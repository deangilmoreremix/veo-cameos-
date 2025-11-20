import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Loader2, CheckCircle, Palette, FileText } from 'lucide-react';
import { brandVoiceService, BrandGuidelines, ComplianceCheck } from '../services/brandVoiceService';

interface BrandGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onGuidelinesUpdated?: () => void;
}

const BrandGuidelinesModal: React.FC<BrandGuidelinesModalProps> = ({
  isOpen,
  onClose,
  userId,
  onGuidelinesUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [guidelines, setGuidelines] = useState<BrandGuidelines | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'check'>('edit');
  const [promptToCheck, setPromptToCheck] = useState('');
  const [compliance, setCompliance] = useState<ComplianceCheck | null>(null);
  const [checkingCompliance, setCheckingCompliance] = useState(false);

  const [formData, setFormData] = useState({
    brandName: '',
    values: '',
    toneOfVoice: '',
    visualStyle: '',
    doList: '',
    dontList: '',
    colorPalette: '',
    fonts: ''
  });

  useEffect(() => {
    if (isOpen && userId) {
      loadGuidelines();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadGuidelines = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await brandVoiceService.loadBrandGuidelines(userId);
      if (data) {
        setGuidelines(data);
        setFormData({
          brandName: data.brandName,
          values: data.values.join(', '),
          toneOfVoice: data.toneOfVoice.join(', '),
          visualStyle: data.visualStyle,
          doList: data.doList.join(', '),
          dontList: data.dontList.join(', '),
          colorPalette: data.colorPalette?.join(', ') || '',
          fonts: data.fonts || ''
        });
      }
    } catch (err) {
      console.error('Failed to load guidelines:', err);
      setError('Failed to load brand guidelines');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setError('You must be logged in to save brand guidelines');
      return;
    }

    if (!formData.brandName.trim()) {
      setError('Brand name is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const guidelinesData: BrandGuidelines = {
        brandName: formData.brandName.trim(),
        values: formData.values.split(',').map(v => v.trim()).filter(Boolean),
        toneOfVoice: formData.toneOfVoice.split(',').map(v => v.trim()).filter(Boolean),
        visualStyle: formData.visualStyle.trim(),
        doList: formData.doList.split(',').map(v => v.trim()).filter(Boolean),
        dontList: formData.dontList.split(',').map(v => v.trim()).filter(Boolean),
        colorPalette: formData.colorPalette.split(',').map(v => v.trim()).filter(Boolean),
        fonts: formData.fonts.trim()
      };

      await brandVoiceService.saveBrandGuidelines(guidelinesData, userId);
      setSuccess('Brand guidelines saved successfully!');
      setGuidelines(guidelinesData);

      if (onGuidelinesUpdated) {
        onGuidelinesUpdated();
      }
    } catch (err) {
      console.error('Failed to save guidelines:', err);
      setError('Failed to save brand guidelines');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!window.confirm('Are you sure you want to delete your brand guidelines?')) return;

    setDeleting(true);
    setError(null);

    try {
      await brandVoiceService.deleteBrandGuidelines(userId);
      setGuidelines(null);
      setFormData({
        brandName: '',
        values: '',
        toneOfVoice: '',
        visualStyle: '',
        doList: '',
        dontList: '',
        colorPalette: '',
        fonts: ''
      });
      setSuccess('Brand guidelines deleted successfully!');

      if (onGuidelinesUpdated) {
        onGuidelinesUpdated();
      }
    } catch (err) {
      console.error('Failed to delete guidelines:', err);
      setError('Failed to delete brand guidelines');
    } finally {
      setDeleting(false);
    }
  };

  const handleCheckCompliance = async () => {
    if (!promptToCheck.trim() || !guidelines) return;

    setCheckingCompliance(true);
    setError(null);

    try {
      const result = await brandVoiceService.checkCompliance(promptToCheck, guidelines);
      setCompliance(result);
    } catch (err) {
      console.error('Compliance check failed:', err);
      setError('Failed to check compliance');
    } finally {
      setCheckingCompliance(false);
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Brand Guidelines</h2>
                    <p className="text-white/60">Define your brand identity and ensure consistency</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              {!userId && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <p className="text-yellow-400 text-sm">Please sign in to manage brand guidelines</p>
                </div>
              )}

              <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'edit'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Edit Guidelines
                </button>
                <button
                  onClick={() => setActiveTab('check')}
                  disabled={!guidelines}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'check'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Check Compliance
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
                  </div>
                ) : activeTab === 'edit' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Brand Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.brandName}
                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                        placeholder="Your brand name"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Core Values (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.values}
                        onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                        placeholder="innovation, sustainability, quality"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Tone of Voice (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.toneOfVoice}
                        onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                        placeholder="professional, friendly, inspiring"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Visual Style
                      </label>
                      <textarea
                        value={formData.visualStyle}
                        onChange={(e) => setFormData({ ...formData, visualStyle: e.target.value })}
                        placeholder="Clean and modern, bright colors, natural lighting..."
                        rows={2}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Do's (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.doList}
                        onChange={(e) => setFormData({ ...formData, doList: e.target.value })}
                        placeholder="show diversity, use natural settings, include product shots"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Don'ts (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.dontList}
                        onChange={(e) => setFormData({ ...formData, dontList: e.target.value })}
                        placeholder="avoid dark themes, no competitor mentions, no controversial topics"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Color Palette (comma-separated) <span className="text-white/40 text-xs">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={formData.colorPalette}
                        onChange={(e) => setFormData({ ...formData, colorPalette: e.target.value })}
                        placeholder="#FF5733, #33FF57, #5733FF"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Fonts <span className="text-white/40 text-xs">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fonts}
                        onChange={(e) => setFormData({ ...formData, fonts: e.target.value })}
                        placeholder="Helvetica, Arial, sans-serif"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={!userId || saving || !formData.brandName.trim()}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Guidelines
                          </>
                        )}
                      </button>

                      {guidelines && (
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {deleting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {!compliance ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">{guidelines?.brandName}</h3>
                          <p className="text-white/60 text-sm mb-4">Check if your video prompt aligns with your brand guidelines</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-white/50">Values:</span>
                              <p className="text-white">{guidelines?.values.join(', ') || 'None set'}</p>
                            </div>
                            <div>
                              <span className="text-white/50">Tone:</span>
                              <p className="text-white">{guidelines?.toneOfVoice.join(', ') || 'None set'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">
                            Video Prompt to Check
                          </label>
                          <textarea
                            value={promptToCheck}
                            onChange={(e) => setPromptToCheck(e.target.value)}
                            placeholder="Enter your video prompt to check against brand guidelines..."
                            rows={4}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                          />
                        </div>

                        <button
                          onClick={handleCheckCompliance}
                          disabled={!promptToCheck.trim() || checkingCompliance}
                          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                          {checkingCompliance ? (
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
                              {compliance.compliant ? 'Brand Compliant' : 'Needs Adjustment'}
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
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Brand-Aligned Version</h4>
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BrandGuidelinesModal;
