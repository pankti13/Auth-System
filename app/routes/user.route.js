const express = require("express");
const router = express.Router();
const { register, login} = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/authorizeJwt");

router.post("/register", register);
router.post("/login", login);

// Protected routes (JWT and role-based authorization)
router.get("/admin-dashboard", verifyToken, checkRole(["admin"]), (req, res) => {
    res.send("Welcome to the admin dashboard");
});

router.get("/user-dashboard", verifyToken, checkRole(["user", "admin"]), (req, res) => {
    res.send("Welcome to the user dashboard");
});

module.exports = router;
