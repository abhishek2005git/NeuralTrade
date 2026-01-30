import React from 'react';
import GlassCard from './GlassCard';
import { BrainCircuit, Fingerprint, Activity } from 'lucide-react';

const NeuralInsights = ({ ticker }) => {
  // In a real scenario, this would fetch from your /api/stocks/:ticker endpoint
  const factors = [
    { label: "Sentiment Analysis", value: "Bullish", icon: <BrainCircuit size={14}/>, color: "text-success" },
    { label: "Pattern Match", value: "Double Bottom", icon: <Fingerprint size={14}/>, color: "text-primary" },
    { label: "Volatility Index", value: "Low", icon: <Activity size={14}/>, color: "text-gray-400" },
  ];

  return (
    <GlassCard className="p-6">
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-6 font-bold">Neural Factors</h4>
      <div className="space-y-6">
        {factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-gray-400">{f.icon}</div>
              <span className="text-xs font-medium text-gray-300">{f.label}</span>
            </div>
            <span className={`text-xs font-bold ${f.color}`}>{f.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default NeuralInsights;