import React from 'react';
import { Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from '../api';

const WishlistToggle = ({ symbol, isSaved }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => wishlistAPI.toggle(symbol),
    onSuccess: () => {
      // Invalidate the wishlist queries so the UI updates globally
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistDetails'] });
    }
  });

  return (
    <button 
      onClick={() => mutation.mutate()}
      className={`p-2 rounded-full transition-all ${
        isSaved ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500 hover:text-white'
      }`}
    >
      <Star size={18} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
};

export default WishlistToggle;