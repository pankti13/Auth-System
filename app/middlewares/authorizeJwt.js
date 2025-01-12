const jwt = require("jsonwebtoken");

// Implements JWT validation
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const jwtToken = token.split(" ")[1];
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: "Access forbidden. You don't have permission to access this resource." });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };
