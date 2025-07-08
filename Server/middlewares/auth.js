// Imports
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

exports.protect = (res, req, next) => {
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

exports.authorize = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) return res.status(403).json({message: "Forbidden"});
        next;
    }
}