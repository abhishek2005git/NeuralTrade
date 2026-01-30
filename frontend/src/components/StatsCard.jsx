import React from 'react';
import GlassCard from './GlassCard';

const StatsCard = ({ label, value, subValue, trend }) => (
  <GlassCard className="p-5 flex flex-col justify-between h-32 group hover:border-primary/50 transition-colors">
    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</p>
    <div>
      <h4 className="text-xl font-mono font-bold">{value}</h4>
      {subValue && (
        <p className={`text-[10px] mt-1 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {subValue}
        </p>
      )}
    </div>
  </GlassCard>
);

export default StatsCard;