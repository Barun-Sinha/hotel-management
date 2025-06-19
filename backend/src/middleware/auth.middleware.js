import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if(!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user =  await User.findById(decoded.userId).select('-password');
        next();
    
    } catch (error) {
        console.error("Error verifying JWT:", error);
        res.status(401).json({ message: 'Unauthorized : invalid token' });
    }
}

export const verifyAdmin = (req, res, next) => {
    if(req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden : Admin access required' });
    }
    next();
};