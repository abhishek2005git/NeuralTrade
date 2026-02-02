import Stock from "../models/Stock.js";
import { redisClient } from '../config/redis.js';
import { fetchPredictionFromAI, fetchPriceFromAPI, getUnifiedTimeline} from '../services/marketService.js';

const CACHE_TTL = 300; // 5 Minutes for Live Price

// --- 📈 GET LIVE PRICE (Redis Cached) ---
export const getLivePrice = async (req, res) => {

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

// Add this to your stockController.js
export const getUnifiedData = async (req, res) => {
    const { ticker } = req.params;
    const tickerUpper = ticker.toUpperCase();
    const cacheKey = `stockpulse:unified:${tickerUpper}`;

    try {
        // 1. Check Redis for a cached version (save those API calls!)
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log(`⚡ Unified Redis HIT for ${tickerUpper}`);
            return res.json({ timeline: JSON.parse(cachedData), source: 'cache' });
        }

        // 2. Fetch the "Weld" data from our Service
        console.log(`📡 Creating Unified Horizon for ${tickerUpper}...`);
        const timeline = await getUnifiedTimeline(tickerUpper);

        if (timeline && timeline.length > 0) {
            // Cache for 1 hour (Predictions don't change every second)
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(timeline));
            return res.json({ timeline, source: 'live' });
        }

        res.status(404).json({ message: "Unable to synthesize timeline" });
    } catch (error) {
        console.error("🔥 Unified Controller Error:", error.message);
        res.status(500).json({ message: "Neural Engine Sync Failure" });
    }
};