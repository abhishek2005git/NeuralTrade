import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import axios from 'axios';

const NeuralNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSentiment = (title) => {
    const bullish = ['surge', 'rally', 'gain', 'growth', 'upbeat', 'buy', 'bull', 'high', 'profit'];
    const bearish = ['crash', 'drop', 'fall', 'slump', 'down', 'sell', 'bear', 'inflation', 'loss', 'debt'];
    const text = title.toLowerCase();
    
    if (bullish.some(word => text.includes(word))) return { type: 'BULLISH', color: 'text-success', bg: 'bg-success/20', border: 'border-success/30', icon: <TrendingUp size={12} /> };
    if (bearish.some(word => text.includes(word))) return { type: 'BEARISH', color: 'text-danger', bg: 'bg-danger/20', border: 'border-danger/30', icon: <TrendingDown size={12} /> };
    return { type: 'NEUTRAL', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: <Minus size={12} /> };
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${import.meta.env.VITE_FINNHUB_KEY}`);
        setNews(response.data.slice(0, 6)); // Fewer items = less clutter
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="p-10 text-[10px] text-gray-600 animate-pulse tracking-widest text-center">SYNCING_NODES...</div>;

  return (
    <div className="flex flex-col gap-5 pr-2">
      <AnimatePresence>
        {news.map((item, idx) => {
          const sentiment = getSentiment(item.headline);
          return (
            <motion.a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative block p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Sentiment Side-Indicator */}
              <div className={`absolute left-0 top-1/4 bottom-1/4 w-[2px] rounded-r-full ${sentiment.bg.replace('/10', '').replace('/20', '')}`} />
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[8px] font-black tracking-[0.2em] px-2 py-0.5 rounded ${sentiment.bg} ${sentiment.color} flex items-center gap-1.5`}>
                  {sentiment.icon} {sentiment.type}
                </span>
                <span className="text-[9px] text-gray-600 font-mono">
                  {new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="text-[13px] font-semibold leading-relaxed text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                {item.headline}
              </h4>
              
              <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] text-gray-500 italic">Source: {item.source}</span>
                <ExternalLink size={10} className="text-gray-500" />
              </div>
            </motion.a>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NeuralNewsFeed;