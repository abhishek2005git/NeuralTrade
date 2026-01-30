// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Get the token from the secure cookie
    token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, please login" });
    }

    try {
        // 2. Verify the token using your JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach the user to the request (excluding the password)
        // This makes 'req.user' available in your controllers
        req.user = await User.findById(decoded.id).select('-password');

        // 4. Move to the next function (the Controller)
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: "Session expired or invalid token" });
    }
};