// Imports
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
    // Authorization header request
    const authHeader = req.headers.authorization;
    // Check for the authorization header
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({message: "No token"})
    };

    const token = authHeader.split(" ")[1]; // Split the token from header (index 1)
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({message: "Invalid token", Error: error.message})
    }
    
};

// middleware/authorize.js
exports.authorize = (roles) => {
    return (req, res, next) => {
        // Ensure req.user exists and has a role
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated or role missing" });
        }

        // Check if the authenticated user's role is included in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        // If authorized, proceed to the next middleware/route handler
        next(); // Call next() to pass control
    };
};