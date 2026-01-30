import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AuthPage from '../pages/AuthPage';

const MainShell = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { activePage } = useUI(); // Removed isSidebarOpen since it's now fixed

  if (isLoading) return null;
  if (!user) return <AuthPage />;

  return (
  <div className="flex h-screen w-screen bg-background text-white overflow-hidden font-sans">
    
    <aside className="h-screen w-20 sticky top-0 z-40 flex-shrink-0">
      <Sidebar />
    </aside>

    <div className="flex-1 flex flex-col min-w-0 h-screen relative">
      <TopBar title={activePage} />
      
      {/* 🟢 FIXED: This main area should be the ONLY one scrolling */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-4 md:p-8 relative">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activePage}
          className="relative z-10 w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  </div>
);
};

export default MainShell;