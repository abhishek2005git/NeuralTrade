import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { authAPI } from '../../api'; // Adjust path based on your folder
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCard = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { refetch } = useAuth();
  
  // Local state for form inputs
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await authAPI.login({ email: formData.email, password: formData.password });
      } else {
        await authAPI.register(formData);
      }
      
      // Tell TanStack Query to re-check the 'authUser' query
      await refetch(); 
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8 shadow-2xl border-white/10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter uppercase">
            {isLogin ? 'Welcome Back' : 'Join Neural'}
          </h2>
          <p className="text-gray-500 text-xs mt-2 font-light tracking-widest uppercase">
            {isLogin ? 'Access your Neural Terminal' : 'Start your AI trading journey'}
          </p>
        </div>

        {error && <p className="text-danger text-xs text-center mb-4 bg-danger/10 p-2 rounded-lg">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <AuthInput 
              icon={<User size={18}/>} 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <AuthInput 
            icon={<Mail size={18}/>} 
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <AuthInput 
            icon={<Lock size={18}/>} 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? 'Enter Terminal' : 'Create Identity'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </GlassCard>
  );
};

const AuthInput = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
      {icon}
    </div>
    <input 
      {...props}
      className="w-full bg-white/5 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white/[0.08] transition-all text-sm font-light text-white"
    />
  </div>
);

export default AuthCard;