import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface PricingTier {
  id: string;
  name: string;
  credits: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (tierId: string, credits: number, price: number) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPricingTiers();
    }
  }, [isOpen]);

  const fetchPricingTiers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching pricing tiers:', error);
      setLoading(false);
      return;
    }

    setTiers(data.map(tier => ({
      id: tier.id,
      name: tier.name,
      credits: tier.credits,
      price: tier.price,
      isActive: tier.is_active,
      sortOrder: tier.sort_order,
    })));
    setLoading(false);
  };

  const handlePurchase = (tier: PricingTier) => {
    setSelectedTier(tier.id);
    onPurchase(tier.id, tier.credits, tier.price);
  };

  const getValuePerCredit = (price: number, credits: number) => {
    return (price / credits).toFixed(2);
  };

  const getBestValue = () => {
    if (tiers.length === 0) return null;
    return tiers.reduce((best, tier) => {
      const currentValue = tier.price / tier.credits;
      const bestValue = best.price / best.credits;
      return currentValue < bestValue ? tier : best;
    });
  };

  const bestValueTier = getBestValue();

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
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full shadow-2xl pointer-events-auto overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Get More Credits</h2>
                  <p className="text-white/60">Choose the perfect package for your video generation needs</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tiers.map((tier) => {
                    const isBestValue = bestValueTier?.id === tier.id;

                    return (
                      <motion.div
                        key={tier.id}
                        className={`relative bg-black/40 border rounded-2xl p-6 transition-all hover:scale-105 cursor-pointer ${
                          isBestValue
                            ? 'border-white/30 ring-2 ring-white/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        whileHover={{ y: -4 }}
                        onClick={() => handlePurchase(tier)}
                      >
                        {isBestValue && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Best Value
                          </div>
                        )}

                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-white">${tier.price}</span>
                          </div>
                          <p className="text-white/40 text-sm mt-1">
                            ${getValuePerCredit(tier.price, tier.credits)} per credit
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-white/80">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>{tier.credits} video generations</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>All Veo models</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>Full HD quality</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>Never expires</span>
                          </div>
                        </div>

                        <button
                          className={`w-full py-3 rounded-xl font-semibold transition-all ${
                            isBestValue
                              ? 'bg-white text-black hover:bg-white/90'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          disabled={selectedTier === tier.id}
                        >
                          {selectedTier === tier.id ? 'Processing...' : 'Purchase'}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-sm text-white/60 text-center">
                  Pay-per-use pricing perfect for entrepreneurs and agencies. Credits never expire.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;
