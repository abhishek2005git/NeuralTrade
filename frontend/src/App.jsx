import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainShell from './components/MainShell';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import Watchlist from './pages/Watchlist';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Or your pulsing neural logo

  return (
    // <Router>
      <Routes>
        {/* 1. Public Auth Route */}
        <Route 
          path="/login" 
          element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} 
        />

        {/* 2. Protected Terminal Routes */}
        <Route 
          path="/*" 
          element={
            user ? (
              <MainShell>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/watchlist" element={<Watchlist />} /> 
                  <Route path="/stock/:ticker" element={<Dashboard />} />
                  <Route path="/settings" element={<div className="p-10 text-gray-500">Settings coming soon...</div>} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes> 
              </MainShell>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    // </Router>
  );
}

export default App;