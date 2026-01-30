import express from "express";
import { getStockPrediction, getLivePrice} from "../controllers/stockController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/price/:ticker', getLivePrice);
router.get("/:ticker", protect ,getStockPrediction);

export default router;