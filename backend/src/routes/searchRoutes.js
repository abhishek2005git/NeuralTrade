import express from "express";
import { searchStocks } from '../controllers/searchController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', protect, searchStocks);
export default router;