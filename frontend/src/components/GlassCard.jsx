import React from 'react';

// src/components/GlassCard.jsx

const GlassCard = ({ children, className, performance }) => {
  // Determine the glow color based on market performance
  const isBullish = performance > 0;
  const isBearish = performance < 0;

  const glowStyle = isBullish 
    ? "border-success/30 shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)]" 
    : isBearish 
    ? "border-danger/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]" 
    : "border-white/10";

  return (
    <div className={`
      relative backdrop-blur-md bg-white/5 border rounded-3xl transition-all duration-500
      ${glowStyle}
      ${className}
    `}>
      {/* 🟢 Optional: Add a subtle inner gradient for more "Glass" depth */}
      <div className={`absolute inset-0 rounded-3xl opacity-10 pointer-events-none 
        ${isBullish ? 'bg-gradient-to-br from-success/20 to-transparent' : ''}
        ${isBearish ? 'bg-gradient-to-br from-danger/20 to-transparent' : ''}
      `} />
      
      {children}
    </div>
  );
};
export default GlassCard;