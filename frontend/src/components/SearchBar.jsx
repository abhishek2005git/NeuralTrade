import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stockAPI } from '../api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate(); // 2. Initialize navigate

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => stockAPI.getSearch(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5,
  });

  const results = data?.data?.results || [];

  // 3. Navigation Handler
  const handleSelect = (symbol) => {
    navigate(`/stock/${symbol.toUpperCase()}`); // Push to the dynamic route
    setQuery(''); // Clear the input
    setIsFocused(false); // Close dropdown
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50">
      <div className={`flex items-center bg-surface/50 backdrop-blur-md border ${
        isFocused ? 'border-primary shadow-glow' : 'border-border'
      } rounded-2xl px-4 py-3 transition-all duration-300`}>
        
        {isFetching ? (
          <Loader2 className="text-primary mr-3 animate-spin" size={20} />
        ) : (
          <Search className="text-gray-500 mr-3" size={20} />
        )}

        <input
          type="text"
          placeholder="Search stocks or companies..."
          className="bg-transparent outline-none w-full text-sm font-light tracking-wide text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          // 4. Using a small delay to ensure onClick fires before onBlur closes the div
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      <AnimatePresence>
        {isFocused && query.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-surface/90 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl"
          >
            {results.length > 0 ? (
              results.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="px-5 py-4 hover:bg-white/5 flex justify-between items-center cursor-pointer transition-colors border-b border-border/50 last:border-0"
                  // 5. Trigger the handler
                  onClick={() => handleSelect(stock.symbol)}
                >
                  <div>
                    <span className="font-bold text-primary mr-2 uppercase">{stock.symbol}</span>
                    <span className="text-gray-400 text-sm font-light">{stock.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase px-2 py-1 bg-white/5 rounded-md tracking-widest border border-white/5">
                    {stock.exchange}
                  </span>
                </div>
              ))
            ) : !isLoading && query.length > 1 ? (
              <div className="p-10 text-center text-gray-500 text-sm font-light">
                <p>No matches found for "{query}"</p>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 text-sm font-light">
                <TrendingUp className="mx-auto mb-2 opacity-20" size={32} />
                <p>Type at least 2 characters to search</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;