const Log = require("../models/log.model");

const logUserActivity = async (req, res, next) => {
    const userId = req.user ? req.user.id : null;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    const logEntry = new Log({
        userId,
        action: `${req.method} ${req.originalUrl}`,
        ipAddress,
        userAgent,
    });

    try {
        await logEntry.save();
        next();
    } catch (error) {
        console.error("Error logging user activity:", error);
        next();
    }
};

module.exports = logUserActivity;