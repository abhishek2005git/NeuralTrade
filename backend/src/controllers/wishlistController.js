import User from '../models/User.js';
import axios from 'axios';
import { fetchPriceFromAPI, fetchSparklineData} from '../services/marketService.js'; // Ensure this uses yahoo-finance2
import { redisClient } from '../config/redis.js';

// Toggle a stock in the user's wishlist
export const toggleWishlist = async (req, res) => {
    const { symbol } = req.body;

    try {
        if (!symbol || symbol.trim() === "") {
            return res.status(400).json({ message: "Invalid ticker symbol" });
        }

        const user = await User.findById(req.user.id);
        const ticker = symbol.trim().toUpperCase(); // Clean and normalize

        const index = user.wishlist.indexOf(ticker);
        
        if (index === -1) {
            // Add if not present
            user.wishlist.push(ticker);
            await user.save();
            return res.json({ message: "Added to wishlist", wishlist: user.wishlist });
        } else {
            // Remove if present
            user.wishlist.splice(index, 1);
            await user.save();
            return res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: "Wishlist update failed", error: error.message });
    }
};

// Get the current user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch wishlist" });
    }
};

export const getWishlistDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const symbols = (user?.wishlist || [])
            .filter(s => s && s.trim() !== "")
            .map(s => s.trim().toUpperCase());

        if (symbols.length === 0) return res.json({ data: [] });

        const richData = await Promise.all(
            symbols.map(async (ticker) => {
                const cacheKey = `stockpulse:price:${ticker}`;
                
                try {
                    const cached = await redisClient.get(cacheKey);
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        // Caching the sparkline ensures we don't spam Yahoo Finance
                        return { ...parsed, symbol: ticker, source: 'cache' };
                    }

                    // 🟢 FETCHING PARALLEL DATA: Live Price + Sparkline
                    const [marketData, sparkline] = await Promise.all([
                        fetchPriceFromAPI(ticker),
                        fetchSparklineData(ticker) 
                    ]);
                    
                    if (marketData) {
                        const stockData = { 
                            ...marketData, 
                            symbol: ticker, 
                            sparkline: sparkline || [], // 🟢 Injecting sparkline array
                            name: marketData.name || ticker 
                        };

                        // Store the full object (including sparkline) in Redis
                        await redisClient.setEx(cacheKey, 120, JSON.stringify(stockData));
                        return { ...stockData, source: 'live' };
                    }
                    
                    return null;
                } catch (err) {
                    console.error(`⚠️ Failed to sync ticker ${ticker}:`, err.message);
                    return null;
                }
            })
        );

        const finalResults = richData.filter(item => item !== null);
        console.log(`📡 Sending ${finalResults.length} assets with Sparklines to Watchlist`);
        res.json({ data: finalResults });

    } catch (error) {
        console.error("🔥 Watchlist Controller Failure:", error.message);
        res.status(500).json({ message: "Watchlist Sync Failed", data: [] });
    }
};
