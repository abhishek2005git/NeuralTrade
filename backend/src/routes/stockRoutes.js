import express from "express";
import { getStockPrediction, getLivePrice, getUnifiedData} from "../controllers/stockController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/price/:ticker', getLivePrice);
router.get("/:ticker", protect ,getStockPrediction);
router.get('/unified/:ticker', getUnifiedData);

export default router;