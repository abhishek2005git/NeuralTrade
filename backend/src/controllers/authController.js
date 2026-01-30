import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Create the user (Password hashing happens in the Model)
        const user = await User.create({ name, email, password });

        // 3. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: '7d' 
        });

        // 4. Set Secure Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // 5. Send Success Response
        return res.status(201).json({
            message: "User registered successfully",
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            }
        });
    } catch (error) {
        // Log the error for you to see in the terminal
        console.error("Registration Error:", error);
        return res.status(500).json({ 
            message: "Registration failed", 
            error: error.message 
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: '7d' 
        });

        // 4. Set Secure Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({
            message: "Login successful",
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                wishlist: user.wishlist 
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export const logoutUser = (req, res) => {
    // Clear the 'token' cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiration to the past
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
    try {
        // req.user is already set by the 'protect' middleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error during auth check" });
    }
};