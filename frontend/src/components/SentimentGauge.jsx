import React from 'react';

const SentimentGauge = ({ score = 65 }) => {
  // Score 0 (Extreme Fear) to 100 (Extreme Greed)
  const isBullish = score > 50;
  const color = isBullish ? "#22c55e" : "#ef4444";
  const rotation = (score / 100) * 180 - 90; // Map score to -90deg to +90deg

  return (
    <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* The Glass Arc */}
        <div className="absolute top-0 left-0 w-48 h-48 border-[12px] border-white/5 rounded-full border-t-transparent" />
        
        {/* The Active Sentiment Path */}
        <div 
          className="absolute top-0 left-0 w-48 h-48 border-[12px] rounded-full border-t-transparent transition-all duration-1000 ease-out"
          style={{ 
            borderColor: `${color}20`, // Transparent version of theme color
            borderRightColor: color,
            transform: `rotate(${rotation}deg)`,
            filter: `drop-shadow(0 0 8px ${color})` 
          }}
        />

        {/* The Centered Score */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-4xl font-black tracking-tighter" style={{ color }}>
            {score}%
          </span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-1">
            {isBullish ? 'Bullish Sentiment' : 'Bearish Sentiment'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;