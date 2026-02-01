import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🟢 Added useLocation
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Star, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Derived source of truth
  const { user, logout } = useAuth();

  // Helper to check if the current path matches
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <div className="h-screen w-20 bg-surface/30 backdrop-blur-xl border-r border-border flex flex-col items-center py-8">
      
      {/* 🟢 Brand Logo */}
      <div className="mb-10">
        <div 
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow hover:scale-110 transition-transform cursor-pointer"
        >
          <TrendingUp size={24} className="text-white" />
        </div>
      </div>

      {/* 🟢 Navigation Nodes */}
      <nav className="flex-1 flex flex-col gap-6">
        <NavItem 
          icon={<LayoutDashboard size={22} />} 
          label="Dashboard" 
          active={isActive('/dashboard') || isActive('/')} 
          onClick={() => navigate('/dashboard')}
        />
        <NavItem 
          icon={<Star size={22} />} 
          label="Watchlist" 
          active={isActive('/watchlist')} 
          onClick={() => navigate('/watchlist')}
        />
        <NavItem 
          icon={<Settings size={22} />} 
          label="Settings" 
          active={isActive('/settings')} 
          onClick={() => navigate('/settings')}
        />
      </nav>

      {/* 🟢 User & Session Termination */}
      <div className="flex flex-col gap-6 items-center pb-4">
        {/* User Avatar Node */}
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-black shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
          </div>
          {/* Tooltip on Hover */}
          <span className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface border border-border rounded-md text-[10px] uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {user?.name || 'Neural Pilot'}
          </span>
        </div>

        {/* 🔴 Logout Node */}
        <button 
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-danger hover:bg-danger/10 transition-all group"
          title="Terminate Session"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Simplified Atomic NavItem
const NavItem = ({ icon, active, onClick, label }) => (
  <div className="relative group flex justify-center">
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-300 relative ${
        active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
          : 'text-gray-500 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      {/* 🟢 Active Indicator Dot */}
      {active && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l-full shadow-[0_0_8px_#primary]" />
      )}
    </button>
    
    {/* Label Tooltip */}
    <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface border border-border rounded-md text-[10px] uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
      {label}
    </span>
  </div>
);

export default Sidebar;