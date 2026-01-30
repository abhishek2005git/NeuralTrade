import { redisClient } from '../config/redis.js';
import axios from 'axios';

export const getTrendingData = async (req, res) => {
    const cacheKey = "stockpulse:trending";
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const symbols = await fetchTrendingTickers();
        
        // Fetch live price/change for each trending symbol in parallel
        const richData = await Promise.all(
            symbols.map(async (s) => {
                const priceData = await fetchPriceFromAPI(s.symbol);
                return { ...s, ...priceData };
            })
        );

        const filtered = richData.filter(d => d.price !== null);
        
        // Store in Neural Cache for 300 seconds (5 mins)
        await redisClient.setEx(cacheKey, 300, JSON.stringify(filtered));
        
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: "Trending Sync Failed" });
    }
};