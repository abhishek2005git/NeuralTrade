import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Newspaper, Star, Loader2, Activity, Cpu, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLivePrice } from '../hooks/useLivePrice';

// Component Imports
import SearchBar from '../components/SearchBar';
import FuturePastChart from '../components/FuturePastChart';
import StatsCard from '../components/StatsCard';
import NeuralInsights from '../components/NeuralInsights';
import SentimentGauge from '../components/SentimentGauge';
import GlassCard from '../components/GlassCard';
import NeuralActivityLog from '../components/NeuralActivityLog';
import SectorHeatmap from '../components/SectorHeatmap';
import TickerTape from '../components/TickerTape';
import NeuralNewsFeed from '../components/NeuralNewsFeed';
import MacroNodes from '../components/MacroNodes';

const Dashboard = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [neuralMetrics, setNeuralMetrics] = useState({
    peak: '---',
    confidence: '89', // Default fallback
    trend: 'NEUTRAL',
    volatility: 'LOW'
  });

  const activeTicker = ticker?.toUpperCase();
  const isStarred = user?.wishlist?.includes(activeTicker);
  const { price, source, isLoading: priceLoading } = useLivePrice(activeTicker);

  const mutation = useMutation({
    mutationFn: (symbol) => wishlistAPI.toggle(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser']);
      queryClient.invalidateQueries(['wishlistDetails']);
    },
  });

  // --- 1. WELCOME STATE ---
  if (!ticker) {
    return (
      <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
        {/* 🟢 THE HORIZON: Clamped horizontal overflow */}
        <div className="w-[calc(100%+4rem)] -mx-8 mb-12 border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-30 min-h-[46px]">
        <TickerTape />
      </div>

        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-12 gap-8 px-6 pb-12">
          
          {/* 🟢 LEFT: INTELLIGENCE FEED (Responsive Height) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col lg:h-[calc(100vh-250px)] border-r border-white/5 pr-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-white flex items-center gap-2">
                <Newspaper size={16} className="text-primary" /> Intelligence Feed
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] text-gray-500 font-mono">LIVE_NODES</span>
              </div>
            </div>
            {/* News container with internal scroll only */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <NeuralNewsFeed />
            </div>
          </div>

          {/* 🟢 RIGHT: COMMAND CENTER */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 lg:h-[calc(100vh-250px)]">
            <div className="w-full">
              <SearchBar />
            </div>
            
            <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
              {/* Heatmap Section */}
              <div className="col-span-12 xl:col-span-8 h-full">
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col border-white/5">
                  <div className="p-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Sector Pulse</span>
                    <Zap size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <SectorHeatmap />
                  </div>
                </GlassCard>
              </div>

              {/* Macro & Alpha Section */}
              <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
                {/* Alpha Badge */}
                <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between group">
                   <div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-primary font-bold block mb-1">Neural Alpha</span>
                      <span className="text-3xl font-black text-white tracking-tighter">94.2<span className="text-xs text-primary ml-1">%</span></span>
                   </div>
                   <Cpu size={28} className="text-primary/40 group-hover:text-primary transition-colors duration-500" />
                </div>

                <div className="flex-1">
                   <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">Macro Nodes</h3>
                   <MacroNodes />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- 2. ACTIVE TERMINAL (No Ticker Tape) ---
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter uppercase">
              {activeTicker} <span className="text-gray-600 font-light">Terminal</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-success text-[10px] uppercase tracking-widest font-bold">
                <Activity size={12} className="animate-pulse" /> Neural Brain Active
              </div>
              <div className={`flex items-center gap-1 text-[9px] uppercase px-2 py-0.5 rounded-full border ${
                source === 'cache' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
              }`}>
                {source === 'cache' ? <Zap size={10} /> : <Activity size={10} />}
                {source}
              </div>
            </div>
          </div>
          <button 
            onClick={() => mutation.mutate(activeTicker)}
            disabled={mutation.isLoading}
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              mutation.isLoading ? 'opacity-50' : 'hover:scale-110 active:scale-95'
            } border-white/10 bg-white/5`}
          >
            {mutation.isLoading ? (
              <Loader2 size={20} className="animate-spin text-primary" />
            ) : (
              <Star size={20} className={isStarred ? "fill-primary text-primary shadow-glow" : "text-gray-500"} />
            )}
          </button>
        </div>
        <div className="w-full max-w-md"><SearchBar /></div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <FuturePastChart ticker={activeTicker} onMetricsUpdate={setNeuralMetrics}/>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              label="Live Price" 
              value={priceLoading ? '---' : `$${price}`} 
              subValue={priceLoading ? 'Syncing...' : 'Real-time'}
            />
            <StatsCard 
              label="Projected Peak" 
              value={neuralMetrics.peak === '---' ? '---' : `$${neuralMetrics.peak}`}
              trend={neuralMetrics.trend === 'BULLISH' ? 'up' : 'down'} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <StatsCard 
              label="Neural Conf." 
              value={`${neuralMetrics.confidence}%`} 
              trend={neuralMetrics.confidence > 85 ? 'up' : 'down'} 
            />
             <StatsCard 
              label="Signal Mode" 
              value={neuralMetrics.trend} 
              subValue="24H Horizon"
            />
          </div>
          <NeuralInsights ticker={activeTicker} metrics={neuralMetrics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;