import Stock from "../models/Stock.js";
import { redisClient } from '../config/redis.js';
import { fetchPredictionFromAI, fetchPriceFromAPI } from '../services/marketService.js';

const CACHE_TTL = 300; // 5 Minutes for Live Price

// --- 📈 GET LIVE PRICE (Redis Cached) ---
export const getLivePrice = async (req, res) => {
    // const { ticker } = req.params;
    // const tickerUpper = ticker.toUpperCase();
    // const cacheKey = `price:${tickerUpper}`;

    // try {
    //     const cachedData = await redisClient.get(cacheKey);
    //     if (cachedData) {
    //         console.log(`cache hit for ${ticker}`);
            
    //         return res.json({ ...JSON.parse(cachedData), source: 'cache' });
    //     }
    //     console.log(`cache miss for ${ticker}`);
    //     const marketData = await fetchPriceFromAPI(tickerUpper);
    //     if (marketData) {
    //         // Save the entire object (Price + Percentage)
    //         await redisClient.setEx(cacheKey, 900, JSON.stringify(marketData));
    //         return res.json({ ...marketData, source: 'live' });
    //     }
    //     res.status(404).json({ message: "Not found" });
    // } catch (error) {
    //     res.status(500).json({ message: "Error", error: error.message });
    // }

    const { ticker } = req.params;
    const tickerUpper = ticker.toUpperCase();
    const cacheKey = `stockpulse:price:${tickerUpper}`;

    try {
        // 1. Check Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log(`⚡ Redis HIT for ${tickerUpper}`);
            return res.json({ ...JSON.parse(cachedData), source: 'cache' });
        }

        // 2. Fetch from Yahoo (Unlimited)
        console.log(`📡 Redis MISS. Calling Yahoo for ${tickerUpper}...`);
        const marketData = await fetchPriceFromAPI(tickerUpper);

        if (marketData) {
            // Since Yahoo is free, we can use a shorter cache (2 mins) for "live" feel
            await redisClient.setEx(cacheKey, 120, JSON.stringify(marketData));
            return res.json({ ...marketData, source: 'live' });
        }

        res.status(404).json({ message: "Asset not found" });
    } catch (error) {
        console.error("🔥 Controller Error:", error.message);
        res.status(500).json({ message: "Internal Engine Error" });
    }
};

// --- 🧠 GET STOCK PREDICTION (Mongo Cached) ---
export const getStockPrediction = async (req, res) => {
    const { ticker } = req.params;
    const tickerUpper = ticker.toUpperCase();

    try {
        let stock = await Stock.findOne({ ticker: tickerUpper });

        if (stock) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            if (stock.lastUpdated > twentyFourHoursAgo) {
                console.log(`📦 Serving ${tickerUpper} from DB`);
                return res.json(stock);
            }
        }

        console.log(`📡 Calling Python Brain for ${tickerUpper}...`);
        const forecast = await fetchPredictionFromAI(tickerUpper);

        stock = await Stock.findOneAndUpdate(
            { ticker: tickerUpper },
            {
                ticker: tickerUpper,
                predictionData: forecast,
                lastUpdated: Date.now()
            },
            { upsert: true, new: true }
        );

        res.json(stock);
    } catch (error) {
        console.error("❌ Prediction Error:", error.message);
        res.status(500).json({ message: "Error fetching stock prediction" });
    }
};