import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expiration time
    });
};

export const registerUser = async(req,res)=>{
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({
            username,
            email,
            password
        });
        await user.save();
        const token = generateToken(user._id);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
        })
        .status(201)
        .json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }

};


export const loginUser = async(req,res)=>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const logoutUser = (req,res)=>{
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    })
    return res.status(200)
    .json({ message: 'User logged out successfully' });
};

export const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
     return res.status(200).json({
        success: true,
        user: req.user,
    });
};

//todo : create a route for admin to get all users
//todo : create a route for admin to delete a user
//todo : create a route for admin to update a user

