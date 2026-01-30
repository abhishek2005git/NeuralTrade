import 'dotenv/config';
import express from "express"
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser"
import stockRoutes from "./routes/stockRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import searchRoutes from './routes/searchRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { connectRedis } from "./config/redis.js";


await connectDB();
connectRedis()

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Must match your Vite URL exactly
  credentials: true,               // Essential for sending the Auth cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('NeuralTrade API is running...');
});

const PORT = process.env.PORT || 4000;

app.use("/api/market", marketRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});