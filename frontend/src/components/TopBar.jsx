import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Zap, CloudSync } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = ({ title = "Dashboard" }) => {
  const { isFetchingGlobal } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-30">
      {/* 1. Page Breadcrumbs / Title */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-surface rounded-lg border border-border">
          <Zap size={16} className="text-primary" />
        </div>
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">
          {title}
        </h2>
      </div>

      {/* 2. Global Sync & Actions */}
      <div className="flex items-center gap-6">
        {/* Sync Status - Lights up when TanStack is fetching */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-full border border-border">
          <motion.div 
            animate={isFetchingGlobal ? { opacity: [0.3, 1, 0.3] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-2 h-2 rounded-full ${isFetchingGlobal ? 'bg-success shadow-[0_0_8px_#10b981]' : 'bg-gray-600'}`}
          />
          <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">
            {isFetchingGlobal ? 'Syncing Brain...' : 'Markets Live'}
          </span>
        </div>

        <button className="p-2 text-gray-500 hover:text-white transition-colors relative">
          <Bell size={20} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;