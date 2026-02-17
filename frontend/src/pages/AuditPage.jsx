import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 🟢 Added for navigation
import { ShieldCheck, Target, Zap, ChevronRight, Activity } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const AuditPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:4000/api/audit/logs');
      return res.data;
    }
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center animate-pulse font-mono text-primary text-xs tracking-[0.5em]">
      DECRYPTING_NEURAL_RECEIPTS...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      {/* 🟢 SECTION 1: SYSTEM OVERVIEW */}
      <div className="grid grid-cols-12 gap-8 mb-16">
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck className="text-primary" size={20} />
             <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-white">System Integrity</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
            {data?.globalScore || "00.0"}<span className="text-primary text-2xl">%</span>
          </h1>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs uppercase tracking-wider font-medium">
            Global precision average across all neural nodes based on 24H price horizon verification.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatMini label="Total Verified" value={data?.totalPredictions || 0} icon={<Activity size={14}/>} />
          <StatMini label="Uptime" value="99.9%" icon={<Zap size={14}/>} />
          <StatMini label="Node Mode" value="Active" icon={<Target size={14}/>} />
        </div>
      </div>

      {/* 🟢 SECTION 2: THE FORENSIC LOG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6 mb-6">
           <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Neural Receipt Log</span>
           <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Accuracy Delta</span>
        </div>

        {data?.logs?.map((log) => (
          <AuditRow key={log._id} log={log} />
        ))}
      </div>
    </div>
  );
};

const AuditRow = ({ log }) => {
  const navigate = useNavigate();
  const isHighAccuracy = log.accuracyScore >= 95;

  const handleNavigation = (e) => {
    // 🟢 CLICK IS REGISTERED HERE
    console.log(`📡 NAVIGATING TO: /stock/${log.ticker}`);
    navigate(`/stock/${log.ticker.toUpperCase()}`);
  };
  
  return (
    <div 
      className="relative z-10 w-full cursor-pointer active:scale-[0.99] transition-transform duration-200"
      onClick={handleNavigation}
    >
      <GlassCard 
        className="p-0 overflow-hidden group hover:border-primary/30 transition-all duration-500 pointer-events-none"
      >
        <div className="flex items-center justify-between p-6 pointer-events-auto">
          <div className="flex items-center gap-8">
            {/* Ticker Info */}
            <div className="w-16">
              <span className="text-lg font-black text-white block">{log.ticker}</span>
              <span className="text-[8px] text-gray-600 font-mono uppercase tracking-tighter">NODE_{log._id.slice(-4)}</span>
            </div>

            {/* Target Data */}
            <div className="hidden md:block">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Target Price</span>
              <span className="text-sm font-mono font-bold text-white">${log.predictionPrice.toFixed(2)}</span>
            </div>

            {/* Actual Data */}
            <div className="hidden md:block">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Market Reality</span>
              <span className="text-sm font-mono font-bold text-gray-300">${log.actualPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Accuracy Score */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className={`text-xl font-black tracking-tighter ${isHighAccuracy ? 'text-primary' : 'text-secondary'}`}>
                {log.accuracyScore}%
              </span>
              <div className="h-1 w-24 bg-white/5 rounded-full mt-2 overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${isHighAccuracy ? 'bg-primary' : 'bg-secondary'}`}
                   style={{ width: `${log.accuracyScore}%` }}
                 />
              </div>
            </div>
            <ChevronRight 
              size={16} 
              className="text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" 
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
const StatMini = ({ label, value, icon }) => (
  <GlassCard className="p-6 flex flex-col gap-2 border-white/5 bg-white/[0.01]">
    <div className="text-primary opacity-50">{icon}</div>
    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{label}</span>
    <span className="text-xl font-bold text-white tracking-tight">{value}</span>
  </GlassCard>
);

export default AuditPage;