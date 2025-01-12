const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // Implement user login using a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { 
            expiresIn: "1h",
        });

        // Return a JWT token upon successful login
        res.json({ token });
        
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        let userId = req.user.id;

        // If the logged-in user is an admin, they can get any user's profile.
        if (req.user.role === "admin" && req.query.userId) {
            userId = req.query.userId;
            const user = await User.findById(userId);
            return res.status(200).json(user);
        }
        // If the logged-in user is a regular user, they can only access their own profile
        else if (req.user.role === "user") {
            const user = await User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        }
        else {
            return res.status(400).json({ error: "User ID is required" });
        }
        
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let updated = 0;
        // Update the email if provided
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: "Email already in use" });
            }
            user.email = email;
            updated = 1;
        }
        // Update the password if provided
        console.log(password);
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            updated = 1; 
        }
        await user.save();
        if (!updated) {
            return res.status(400).json({ message: "No data provided to update" });
        }
        return res.status(200).json({ message: "User profile updated successfully" });
        } catch (error) {
        res.status(500).json({ error: "Failed to update user profile" });
    }
};

// Implement "Forgot Password" feature
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // Send reset email
        const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Please use the following link: ${resetUrl}`,
        });
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Error sending password reset email" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password has been reset" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reset password" });
    }
};

module.exports = { register, login, deleteUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword };
