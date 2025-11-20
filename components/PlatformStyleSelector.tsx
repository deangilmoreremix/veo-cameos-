import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Instagram, Youtube, Music, Facebook, Twitter } from 'lucide-react';
import { stylePresetService, StylePreset } from '../services/stylePresetService';

interface PlatformStyleSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  selectedStylePreset: string | null;
  onStylePresetChange: (presetId: string | null) => void;
  userId: string | null;
  characterId?: string;
}

export const PlatformStyleSelector: React.FC<PlatformStyleSelectorProps> = ({
  selectedPlatform,
  onPlatformChange,
  selectedStylePreset,
  onStylePresetChange,
  userId,
  characterId
}) => {
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadStylePresets();
    }
  }, [userId, characterId]);

  const loadStylePresets = async () => {
    if (!userId) return;
    setLoading(true);
    const presets = await stylePresetService.getUserStylePresets(userId, characterId);
    setStylePresets(presets);
    setLoading(false);
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, aspect: '9:16', color: 'from-pink-500 to-purple-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music, aspect: '9:16', color: 'from-cyan-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, aspect: '16:9', color: 'from-red-500 to-red-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, aspect: '1:1', color: 'from-blue-500 to-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, aspect: '16:9', color: 'from-sky-400 to-blue-500' }
  ];

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-3 text-white/90">
          Target Platform
        </label>
        <div className="grid grid-cols-5 gap-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.id;

            return (
              <button
                key={platform.id}
                onClick={() => onPlatformChange(platform.id)}
                className={`relative p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-white/30 bg-white/10 shadow-lg scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-[10px] font-medium text-center text-white/80">{platform.name}</div>
                <div className="text-[8px] text-center text-white/50 mt-0.5">{platform.aspect}</div>
                {isSelected && (
                  <motion.div
                    layoutId="platform-indicator"
                    className="absolute inset-0 border-2 border-white rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-white/90 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Style Preset (Optional)
        </label>
        {loading ? (
          <div className="text-sm text-white/60 text-center py-4">Loading presets...</div>
        ) : stylePresets.length === 0 ? (
          <div className="text-sm text-white/60 text-center py-4 bg-white/5 rounded-lg border border-white/10">
            No style presets yet. Use Style Transfer to create one!
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onStylePresetChange(null)}
              className={`p-3 rounded-lg border transition-all ${
                selectedStylePreset === null
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-medium text-center">None</div>
            </button>
            {stylePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onStylePresetChange(preset.id)}
                className={`p-3 rounded-lg border transition-all relative ${
                  selectedStylePreset === preset.id
                    ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {preset.thumbnail_url ? (
                  <img
                    src={preset.thumbnail_url}
                    alt={preset.name}
                    className="w-full h-16 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded mb-2 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white/40" />
                  </div>
                )}
                <div className="text-xs font-medium text-center truncate">{preset.name}</div>
                {preset.is_favorite && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
