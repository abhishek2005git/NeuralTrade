import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import axios from 'axios';

const FuturePastChart = ({ ticker, onMetricsUpdate }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['unifiedTimeline', ticker],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:4000/api/stocks/unified/${ticker}`);
      console.log("📈 RAW UNIFIED DATA:", res.data.timeline);
      return res.data.timeline;
    },
    enabled: !!ticker,
  });

  useEffect(() => {
    if (data && data.length > 0 && onMetricsUpdate) {
      const futurePoints = data.filter(i => i.type === 'future');
      const pastPoints = data.filter(i => i.type === 'past');

      if (futurePoints.length > 0) {
        // 1. Calculate Peak
        const peakPrice = Math.max(...futurePoints.map(i => i.price)).toFixed(2);

        // 2. Calculate Trend
        const firstFuture = futurePoints[0].price;
        const lastFuture = futurePoints[futurePoints.length - 1].price;
        const trendLabel = lastFuture > firstFuture ? "BULLISH" : "BEARISH";

        // 3. Simple Confidence Logic (based on past volatility)
        const prices = pastPoints.map(p => p.price);
        const range = Math.max(...prices) - Math.min(...prices);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const volatility = (range / avgPrice) * 100;
        
        // Lower volatility in the past increases AI confidence in the trend
        const confidenceScore = Math.max(72, 98 - (volatility * 1.5)).toFixed(0);

        // 4. Update the Dashboard
        onMetricsUpdate({
          peak: peakPrice,
          trend: trendLabel,
          confidence: confidenceScore,
          volatility: volatility.toFixed(2)
        });
      }
    }
  }, [data, onMetricsUpdate]);

  if (isLoading) return <div className="h-[400px] flex items-center justify-center animate-pulse text-gray-500">SYNCHRONIZING TIMELINES...</div>;

  // 🟢 Custom Tooltip for the Neural feel
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const isFuture = entry.type === 'future';
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
            {isFuture ? 'Neural Projection' : 'Market Reality'}
          </p>
          <p className="text-xl font-bold text-white">${entry.price.toFixed(2)}</p>
          <p className="text-[9px] text-primary/60 mt-1 font-mono">
            {new Date(entry.timestamp).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[450px] bg-surface/10 rounded-3xl p-6 border border-white/5 relative group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Unified Horizon
        </h3>
        <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase"><span className="w-2 h-0.5 bg-primary" /> Reality</div>
            <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase"><span className="w-2 h-0.5 bg-secondary border-t border-dashed" /> Forecast</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* Gradient for the Past (Reality) */}
            <linearGradient id="colorPast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
            </linearGradient>
            {/* Gradient for the Future (Neural) */}
            <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7000ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7000ff" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          
          <XAxis 
            dataKey="timestamp" 
            hide 
          />
          <YAxis 
            hide={false} 
            
            domain={[
              (dataMin) => dataMin * 0.98, // 2% padding below
              (dataMax) => dataMax * 1.02  // 2% padding above
            ]} 
            
            orientation="right" // Professional trading charts usually have price on the right
            stroke="rgba(255,255,255,0.1)" // Very subtle line
            tick={{ fontSize: 10, fill: '#666', fontWeight: 'bold', fontFamily: 'monospace' }} 
            tickFormatter={(val) => `$${val.toFixed(2)}`} // Clean 2-decimal format
            axisLine={false}
            tickLine={false}
            width={50} // Fixed width so the chart doesn't jump when prices change
          />
          
          <Tooltip content={<CustomTooltip />} />

          {/* 🟢 THE REALITY LINE (Solid) */}
          <Area
            type="monotone"
            // This draws everything tagged 'past'
            dataKey={(item) => item.type === 'past' ? item.price : null}
            stroke="#00f2ff"
            strokeWidth={3}
            fill="url(#colorPast)"
            connectNulls={true} // 🟢 Set to true to bridge the small gap to the next point
            animationDuration={2000}
          />

          {/* 🟢 THE NEURAL LINE (Dashed) */}
          <Area
            type="monotone"
            // 🟢 THE FIX: If it's 'future' OR it's the very last 'past' point, render it.
            // This creates the "overlap" that closes the gap.
            dataKey={(item) => {
              const isLastPast = item === data.filter(i => i.type === 'past').pop();
              return (item.type === 'future' || isLastPast) ? item.price : null;
            }}
            stroke="#7000ff"
            strokeWidth={3}
            strokeDasharray="8 5"
            fill="url(#colorFuture)"
            connectNulls={true} // 🟢 Important
          />

          {/* 🟢 THE PRESENT ANCHOR */}
          <ReferenceLine 
            x={data.find(i => i.type === 'future')?.timestamp} 
            stroke="#ffffff" 
            strokeOpacity={0.4}
            strokeDasharray="3 3"
            label={{ 
              position: 'top', 
              value: 'PRESENT BOUNDARY', // Longer text to test centering
              fill: '#ffffff', 
              fontSize: 8, 
              fontWeight: 'bold',
              offset: 15, // 🟢 Pushes it down slightly so it doesn't hit the ceiling
              className: "tracking-[0.2em]"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuturePastChart;