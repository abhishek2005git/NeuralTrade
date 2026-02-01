import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);