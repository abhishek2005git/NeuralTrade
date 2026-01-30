// src/components/NeuralActivityLog.jsx
import React, { useState, useEffect } from 'react';

const LOG_ENTRIES = [
  "> INITIALIZING NEURAL CORE...",
  "> SCANNING 1,200+ GLOBAL MARKET NODES...",
  "> SENTIMENT SHIFT DETECTED FOR $TSLA (BULLISH)",
  "> VOLATILITY SPIKE IN ENERGY SECTOR...",
  "> CROSS-REFERENCING HISTORICAL PATTERNS...",
  "> ALPHA SIGNAL DETECTED: $NVDA (92% CONFIDENCE)"
];

const NeuralActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [LOG_ENTRIES[Math.floor(Math.random() * LOG_ENTRIES.length)], ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] space-y-2 text-primary opacity-80">
      {logs.map((log, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-left duration-500">
          {log}
        </div>
      ))}
    </div>
  );
};

export default NeuralActivityLog