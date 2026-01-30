import React, { useState } from 'react';
import AuthCard from '../components/auth/AuthCard';

const AuthPage = () => {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Visual Background Details */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] bg-success/5 rounded-full blur-[100px]" />

      <AuthCard mode={mode} />
      
      <button 
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-8 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
      >
        {mode === 'login' ? "New here? Create an identity" : "Already an agent? Log in"}
      </button>
    </div>
  );
};

export default AuthPage;