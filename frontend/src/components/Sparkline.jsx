import React from 'react';


// src/components/Sparkline.jsx
const Sparkline = ({ data, color = "#22c55e" }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div className="absolute bottom-4 left-0 w-full px-6 opacity-20 italic text-[8px] text-gray-500 uppercase tracking-tighter">
        Generating Neural Waveform...
      </div>
    );
  }
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const width = 100;
  const height = 40;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-20 absolute -bottom-2 left-0 pointer-events-none z-0"
      preserveAspectRatio="none"
    >
      {/* 🟢 Subtle Gradient Area */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 🟢 Soft Background Fill */}
      <polyline
        fill={`url(#gradient-${color})`}
        points={`${points} ${width},${height} 0,${height}`}
        className="opacity-20"
      />

      {/* 🟢 The Main Glow Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-40" // Reduced from 60 for a "Cleaner" look
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} 
      />
    </svg>
  );
};

export default Sparkline