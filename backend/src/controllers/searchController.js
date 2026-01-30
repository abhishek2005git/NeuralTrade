import axios from 'axios';

export const searchStocks = async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.FMP_API_KEY;

    try {
        // 1. Trending Logic (Fallback when query is empty)
        // We use the stable market-gainers endpoint for 2026
        if (!query || query.length < 2) {
            const trendingUrl = `https://financialmodelingprep.com/stable/biggest-gainers?apikey=${apiKey}`;
            const trendingRes = await axios.get(trendingUrl);
            
            const trending = trendingRes.data.slice(0, 5).map(s => ({
                symbol: s.symbol,
                name: s.name,
                price: s.price,
                change: s.changesPercentage 
            }));
            
            return res.json({ type: 'trending', results: trending });
        }

        // 2. Omni-Search Logic using the STABLE endpoints
        // Documentation confirmed: https://financialmodelingprep.com/stable/search-name
        const searchUrl = `https://financialmodelingprep.com/stable/search-name?query=${query}&limit=10&apikey=${apiKey}`;
        const searchRes = await axios.get(searchUrl);

        // Map the results to our minimalist UI format
        const results = searchRes.data.map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            exchange: stock.exchange || stock.stockExchange,
            currency: stock.currency
        }));

        res.json({ type: 'search', results });

    } catch (error) {
        console.error("FMP API Error:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Search failed", 
            error: error.response?.data?.['Error Message'] || error.message 
        });
    }
};