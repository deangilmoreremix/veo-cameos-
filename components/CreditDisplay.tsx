import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreditDisplayProps {
  credits: number;
  onPurchase: () => void;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ credits, onPurchase }) => {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
        <Coins className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-semibold text-white tracking-wide">
          {credits}
        </span>
        <span className="text-xs text-white/50">credits</span>
      </div>

      <button
        onClick={onPurchase}
        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4" />
        Buy
      </button>
    </motion.div>
  );
};

export default CreditDisplay;
