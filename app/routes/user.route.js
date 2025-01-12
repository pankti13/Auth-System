const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const { register, login, deleteUser, getUserProfile, updateUserProfile} = require("../controllers/user.controller");
const { forgotPassword, resetPassword, validateResetPasswordToken } = require("../controllers/user.controller");
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

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", validateResetPasswordToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
