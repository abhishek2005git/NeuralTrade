import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { stockAPI } from '../api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const FuturePastChart = ({ ticker }) => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['prediction', ticker],
    queryFn: () => stockAPI.getPrediction(ticker),
    enabled: !!ticker,
    retry: 1,
  });

  // 1. Robust Data Extraction
  // We check if the response exists and extract the nested data array.
  // If it's not an array, we default to an empty list to prevent .slice() crashes.

//   const chartData = Array.isArray(response?.data) ? response.data : [];
const chartData = Array.isArray(response?.data?.predictionData) 
  ? response.data.predictionData 
  : [];

  if (isLoading) return (
    <div className="w-full h-[450px] bg-surface/30 animate-pulse rounded-3xl border border-border flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Synchronizing Neural Brain...</span>
    </div>
  );

  // 2. Error State UI (Prevents Black Screen)
  if (isError || chartData.length === 0) return (
    <div className="w-full h-[450px] bg-surface/20 backdrop-blur-md rounded-3xl border border-danger/20 flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="text-danger mb-4 opacity-50" size={40} />
      <h3 className="text-sm font-bold uppercase tracking-widest text-danger mb-2">Neural Connection Refused</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-6 font-light">
        The Python AI Engine (Port 8000) is currently offline. Ensure the backend brain is active.
      </p>
      <button 
        onClick={() => refetch()}
        className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] uppercase tracking-widest transition-all"
      >
        <RefreshCw size={12} /> Retry Handshake
      </button>
    </div>
  );

  return (
    <div className="w-full h-[450px] bg-surface/20 backdrop-blur-md rounded-3xl border border-border p-6 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-light text-gray-400 uppercase tracking-widest">Projection: {ticker}</h3>
        <div className="flex gap-4 text-[10px] uppercase tracking-tighter">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary shadow-glow" /> Historical
          </div>
          <div className="flex items-center gap-2 text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Neural AI
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #262626', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />

          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />

          <Line 
            type="monotone" 
            dataKey="predictedPrice" 
            stroke="#10b981" 
            strokeDasharray="5 5"
            strokeWidth={3}
            dot={false}
            animationDuration={2000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuturePastChart;