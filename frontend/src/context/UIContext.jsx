import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar, activePage, setActivePage }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);