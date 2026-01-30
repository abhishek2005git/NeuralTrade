// backend/config/redis.js
import { createClient } from 'redis';

// Use the URL from .env, or fallback to local only if absolutely necessary
const redisClient = createClient({
    url: process.env.REDIS_URL 
});

redisClient.on('error', (err) => {
    // This is the block catching your ECONNREFUSED
    console.error('❌ Redis Connection Failed. Ensure REDIS_URL is correct in .env');
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('⚡ Upstash Neural Brain Linked');
        }
    } catch (err) {
        console.error('❌ Failed to establish Redis Link:', err.message);
    }
};

export { redisClient };