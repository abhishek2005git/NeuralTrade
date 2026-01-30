import express from "express";
import { getTrendingData } from '../controllers/marketController.js';
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/trending', getTrendingData);

export default router;