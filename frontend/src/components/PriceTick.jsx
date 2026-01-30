import React from 'react';
import { useLivePrice } from '../hooks/useLivePrice';
import { motion, AnimatePresence } from 'framer-motion';

const PriceTick = ({ symbol, fontSize = "text-lg" }) => {
  const price = useLivePrice(symbol);

  return (
    <div className="flex items-center gap-2 font-mono">
      <AnimatePresence mode="wait">
        <motion.span 
          key={price}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${fontSize} font-bold tracking-tighter`}
        >
          {price ? `$${price}` : '---'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default PriceTick;