import axios from 'axios';
import YahooFinance from 'yahoo-finance2';

const yahoo = new YahooFinance();
// 1. Prediction Service (Python Brain)
export const fetchPredictionFromAI = async (ticker) => {
    const url = `${process.env.PYTHON_BRAIN_URL}/predict/${ticker}`;
    const response = await axios.get(url);
    return response.data.forecast;
};

export const fetchPriceFromAPI = async (ticker) => {
    try {
        const quote = await yahoo.quote(ticker.toUpperCase());
        if (quote) {
            return {
                symbol: ticker.toUpperCase(), // 🟢 MUST return the short ticker
                price: quote.regularMarketPrice,
                changesPercentage: quote.regularMarketChangePercent,
                name: quote.shortName || quote.longName,
                lastUpdated: Date.now()
            };
        }
    } catch (error) {
        console.error(`❌ Yahoo Error for ${ticker}:`, error.message);
        return null;
    }
};

// backend/services/marketService.js

export const fetchSparklineData = async (ticker) => {
    try {
        const now = new Date();
        // 🟢 FIX: Look back 7 days to account for weekends and holidays
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        const result = await yahoo.chart(ticker, {
            period1: sevenDaysAgo, // Covers the weekend gap
            period2: now,
            interval: '1h' 
        });
        
        if (!result.quotes || result.quotes.length === 0) {
            console.log(`⚠️ No sparkline data found for ${ticker}`);
            return [];
        }

        // Filter out nulls and take the last 24 available data points
        // This ensures the sparkline represents a consistent "day of trading"
        const cleanData = result.quotes
            .map(q => q.close)
            .filter(val => val !== null);

        return cleanData.slice(-24); 
    } catch (error) {
        console.error(`⚠️ Sparkline Engine Error for ${ticker}:`, error.message);
        return [];
    }
};

export const fetchTrendingTickers = async () => {
    try {
        // Fetches top 10 trending symbols (S&P 500, Nasdaq, and high-volatility stocks)
        const result = await yahoo.trendingSymbols('US', { count: 10 });
        
        // Map the results to a clean format for the TickerTape
        return result.quotes.map(quote => ({
            symbol: quote.symbol,
            name: quote.symbol, // Yahoo's trending endpoint often returns just the symbol
        }));
    } catch (error) {
        console.error("⚠️ Trending Engine Error:", error.message);
        return [];
    }
};

export const getUnifiedTimeline = async (ticker) => {
    try {
        const historyData = await fetchSparklineData(ticker); 
        const predictionData = await fetchPredictionFromAI(ticker);

        // 🟢 DEFENSIVE CHECK: If either is empty, don't crash, return empty array
        if (!historyData || historyData.length === 0 || !predictionData || predictionData.length === 0) {
            console.warn(`⚠️ Incomplete data for ${ticker}. History: ${historyData?.length}, Pred: ${predictionData?.length}`);
            return []; 
        }

        const now = Date.now();
        const currentPrice = historyData[historyData.length - 1];

        const past = historyData.map((price, i) => ({
            timestamp: now - (historyData.length - 1 - i) * 3600000,
            price: Number(price),
            type: 'past'
        }));

        const offset = currentPrice - predictionData[0];
        const future = predictionData.map((price, i) => ({
            timestamp: now + (i + 1) * 3600000, 
            price: Number(price) + offset,
            type: 'future'
        }));

        return [...past, ...future];
    } catch (error) {
        console.error("🔥 Timeline Merge Error:", error.message);
        return []; // 🟢 Return empty array so the controller doesn't throw 500
    }
};