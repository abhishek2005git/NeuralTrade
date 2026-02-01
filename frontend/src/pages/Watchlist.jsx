import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wishlistAPI } from '../api';
import GlassCard from '../components/GlassCard';
import Sparkline from '../components/Sparkline';
import { useLivePrice } from '../hooks/useLivePrice';
import { TrendingUp, ArrowUpRight, Activity, Zap, Search } from 'lucide-react';


const WatchlistCard = ({ stock }) => {
  const navigate = useNavigate();
  const ticker = stock?.symbol || "UNKNOWN";
  const displayName = stock?.name || ticker;

  const { price, changePercent, source, isLoading } = useLivePrice(ticker);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/stock/${ticker.toUpperCase()}`);
  };

  const isPositive = Number(changePercent) >= 0;
  const themeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <GlassCard 
      // 🟢 min-h-[180px] provides the space needed for the sparkline background
      className="p-0 overflow-hidden group transition-all duration-500 relative min-h-[180px]"
      performance={Number(changePercent)}
    >
      <div 
        onClick={handleNavigate}
        // 🟢 pb-12 pushes the text up so it doesn't collide with the sparkline
        className="p-6 pb-12 cursor-pointer w-full h-full relative z-10 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tighter uppercase group-hover:text-primary transition-colors">
              {ticker}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate max-w-[150px]">
              {displayName}
            </p>
          </div>
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter">
              {isLoading ? '---' : `$${price}`}
            </span>
            <span className={`text-[8px] uppercase tracking-tighter flex items-center gap-1 mt-1 font-bold ${
              source === 'cache' ? 'text-amber-500' : 'text-success'
            }`}>
              {source === 'cache' ? <Zap size={8} /> : <Activity size={8} />}
              Neural {source}
            </span>
          </div>

          <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
            isPositive 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-danger/10 text-danger border-danger/20'
          }`}>
            {isPositive ? '+' : ''}{changePercent}%
          </div>
        </div>
      </div>

      {/* 🟢 Render Sparkline as a background element (z-0) */}
      {!isLoading && stock?.sparkline && (
        <Sparkline data={stock.sparkline} color={themeColor} />
      )}
    </GlassCard>
  );
};



const Watchlist = () => {
  const navigate = useNavigate();

  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ['wishlistDetails'],
    queryFn: async () => {
      const res = await wishlistAPI.getDetails();
      // 🟢 DEBUG LOG: This will show you the exact structure in the browser console
      console.log("📡 FULL RESPONSE FROM API:", res);
      return res;
    },
    refetchInterval: 30000, 
  });

  // 🔴 THE BULLETPROOF FIX
  let stocks = [];
  
  // Try all possible data paths
  const actualArray = wishlist?.data?.data || wishlist?.data || wishlist; 

  if (Array.isArray(actualArray)) {
    stocks = actualArray.filter(s => {
      // 🟢 Logic: Keep anything that has a name or a symbol
      const identifier = s?.symbol || s?.name || (typeof s === 'string' ? s : null);
      return identifier && identifier.trim() !== "";
    });
  } else {
    // This handles the "received: object" log you saw
    console.warn("📡 Neural Engine Warning: Still no array found. Type:", typeof possibleArray);
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <header className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold mb-2">Saved Assets</h2>
        <h1 className="text-4xl font-bold tracking-tighter uppercase">
          Your <span className="text-gray-600">Watchlist</span>
        </h1>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs font-mono">
          Engine Error: {error.message}. Check terminal logs.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-surface/20 animate-pulse rounded-3xl border border-white/5" />
          ))}
        </div>
      ) : stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, index) => (
            <WatchlistCard key={stock.symbol || `stock-${index}`} stock={stock} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-surface/20 rounded-3xl border border-dashed border-white/10">
          <div className="relative mb-6">
            <TrendingUp className="text-gray-700 opacity-20" size={64} />
            <Search className="absolute -bottom-2 -right-2 text-primary opacity-40" size={24} />
          </div>
          <p className="text-gray-500 font-light italic mb-6">Your neural watchlist is empty or symbols are restricted.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all hover:text-black font-bold"
          >
            Start Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;