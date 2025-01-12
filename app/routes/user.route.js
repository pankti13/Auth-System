const express = require("express");
const router = express.Router();
const { register, login, deleteUser, getUserProfile, updateUserProfile} = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/authorizeJwt");

router.post("/register", register);
router.post("/login", login);

// Protected routes (JWT and role-based authorization)
router.delete("/admin-dashboard", verifyToken, checkRole(["admin"]), deleteUser);
router.get("/user-dashboard", verifyToken, checkRole(["user", "admin"]), getUserProfile);
router.put("/user-dashboard", verifyToken, checkRole(["user"]), updateUserProfile);

module.exports = router;
