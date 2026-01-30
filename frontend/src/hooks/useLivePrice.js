// src/hooks/useLivePrice.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useLivePrice = (symbol) => {
  const ticker = symbol?.toUpperCase();

  const { data, isLoading } = useQuery({
    queryKey: ['livePrice', ticker],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:4000/api/stocks/price/${ticker}`);
      return response.data; // This now includes { price, changesPercentage, source }
    },
    enabled: !!ticker,
    refetchInterval: 60000, // Refresh 
    staleTime: 9000,
  });

  return {
    price: data?.price ? Number(data.price).toFixed(2) : '0.00',
    // Extracting the percentage from the backend response
    changePercent: data?.changesPercentage ? data.changesPercentage.toFixed(2) : '0.00',
    source: data?.source || 'syncing',
    isLoading
  };
};