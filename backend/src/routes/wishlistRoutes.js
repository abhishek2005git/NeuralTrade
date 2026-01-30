import express from 'express';
import { toggleWishlist, getWishlist, getWishlistDetails} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/toggle', protect, toggleWishlist);
router.get('/', protect, getWishlist);
router.get('/details', protect, getWishlistDetails);

export default router;