import React from 'react';
import { Brain, Target, ShieldCheck, AlertCircle } from 'lucide-react';

const NeuralInsights = ({ ticker, metrics }) => {
  // 🟢 The "Intelligence Engine" logic
  const getTacticalAnalysis = () => {
    if (!metrics || metrics.peak === '---') {
      return "Initialising Neural Link... Awaiting stable data stream.";
    }

    const isBullish = metrics.trend === 'BULLISH';
    const confidence = parseInt(metrics.confidence);

    const trendText = isBullish 
      ? `detects a positive accumulation phase for ${ticker}.` 
      : `suggests a period of distribution or consolidation for ${ticker}.`;

    const targetText = isBullish
      ? `Projected resistance level sits at $${metrics.peak}, representing the current high-probability ceiling.`
      : `Downward momentum suggests a test of support nodes. Projected floor stabilization near current levels.`;

    const confidenceText = confidence > 85 
      ? "Signal strength is HIGH, suggesting low variance in projected path."
      : "Signal strength is MODERATE. Intraday volatility may cause temporary node deviation.";

    return {
      summary: `Neural Alpha ${trendText}`,
      target: targetText,
      risk: confidenceText
    };
  };

  const analysis = getTacticalAnalysis();

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden group">
      {/* Background Glow Decor */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[80px] transition-colors duration-1000 ${
        metrics.trend === 'BULLISH' ? 'bg-primary/20' : 'bg-secondary/20'
      }`} />

      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white flex items-center gap-2">
          <Brain size={16} className="text-primary" /> Intelligence Summary
        </h3>
        <span className="text-[9px] font-mono text-gray-500 animate-pulse">v4.2.0_STABLE</span>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex gap-4">
          <div className="mt-1"><Target size={14} className="text-primary" /></div>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            <span className="text-white font-bold">TACTICAL_POSITION:</span> {typeof analysis === 'string' ? analysis : analysis.summary}
          </p>
        </div>

        {typeof analysis !== 'string' && (
          <>
            <div className="flex gap-4">
              <div className="mt-1"><ShieldCheck size={14} className="text-success" /></div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                {analysis.target}
              </p>
            </div>
            
            <div className="flex gap-4 border-t border-white/5 pt-4">
              <div className="mt-1"><AlertCircle size={14} className="text-amber-400" /></div>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider">
                <span className="text-amber-400/80 font-bold">MODEL_RISK:</span> {analysis.risk}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Terminal Footer Decor */}
      <div className="mt-2 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/10" />)}
        </div>
        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Neural_Sync_Complete</span>
      </div>
    </div>
  );
};

export default NeuralInsights;