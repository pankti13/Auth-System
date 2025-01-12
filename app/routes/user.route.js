const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const { register, login, deleteUser, getUserProfile, updateUserProfile} = require("../controllers/user.controller");
const { forgotPassword, resetPassword } = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/authorizeJwt");
const logUserActivity = require("../middlewares/logUserActivity");

router.post("/register", register);
router.post("/login", login);

router.use(verifyToken);
router.use(logUserActivity); 

// Protected routes (JWT and role-based authorization)
router.delete("/admin-dashboard", verifyToken, checkRole(["admin"]), deleteUser);
router.get("/user-dashboard", verifyToken, getUserProfile);
router.put("/user-dashboard", verifyToken, checkRole(["user"]), updateUserProfile);

router.post("/forgot-password", verifyToken, forgotPassword);
router.get("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired password reset token" });
        }
        return res.status(200).json({ message: "Token is valid. You can now reset your password." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error validating reset token" });
    }
});
router.post("/reset-password/:token", verifyToken, resetPassword);

module.exports = router;
