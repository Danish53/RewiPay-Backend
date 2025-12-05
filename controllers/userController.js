import { sendEmail } from "../config/mailer.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc Register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
};

// @desc Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// @desc Forgot password (send OTP)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = user.getResetToken();
    await user.save();

    const message = `Your OTP for password reset is: ${resetToken} (valid for 10 minutes)`;
    try {
        await sendEmail(user.email, "Password Reset OTP", message);
        res.json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).json({ message: "Email could not be sent" });
    }
};

// verify otp
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid OTP or expired" });
    res.json({ message: "OTP verified" });
};

// @desc Reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid OTP or expired" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
};
