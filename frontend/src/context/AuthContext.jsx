// src/context/AuthContext.jsx
import React, { createContext, useContext } from 'react';
import { useQuery, useIsFetching, useMutation, useQueryClient } from '@tanstack/react-query'; // Added useMutation & useQueryClient
import { authAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    // 1. TanStack Query handles the "Me" check
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const { data } = await authAPI.getMe();
            return data;
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    // 🟢 2. ADD LOGOUT MUTATION
    const logoutMutation = useMutation({
        mutationFn: async () => {
            return await authAPI.logout(); // Ensure your api/index.js has authAPI.logout defined
        },
        onSuccess: () => {
            // This instantly clears the user data in the cache and redirects
            queryClient.setQueryData(['authUser'], null);
            // Optional: Clear all other queries (watchlist, etc.)
            queryClient.clear();
        },
    });

    const logout = () => logoutMutation.mutate();

    const isFetchingGlobal = useIsFetching();

    // 🟢 3. ADD LOGOUT TO VALUE
    return (
        <AuthContext.Provider value={{ user, isLoading, isFetchingGlobal, refetch, logout }}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary font-bold text-2xl tracking-tighter">
                            NEURAL<span className="text-white">TRADE</span>
                        </motion.div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-4 italic">Initializing Neural Brain...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {isFetchingGlobal > 0 && !isLoading && (
                <div className="fixed top-0 left-0 right-0 h-[1px] z-[1000] overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-full bg-primary shadow-glow" />
                </div>
            )}

            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);