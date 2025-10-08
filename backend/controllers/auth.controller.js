import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/email.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const{email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields a needed");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password,12);
        const verificationToken = Math.floor(100000 + Math.random() *99999).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 3600000 * 4 // 4 hours
        })

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "user creted successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()},
        })
        if(!user) {
            return res.status(400).json({message: "Invalid or expired verification code"});
        }

        user.isVerified = true;;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            message: "Email verified successfully",
            user : {
                ...user._doc,
                password: undefined,
            }
        })

    }catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid) {
            res.status(400).json({message: "Invalid password"})
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            res.status(400).json({message: "User with this email does not exist"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({message: "Password reset link has been sent to your registered email address"});
    } catch (error) {
        console.log("Error in forgot password", error)
        return res.status(500).json({success : false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordExpiresAt: {$gt : Date.now()},
            resetPasswordToken: token,
        })

        if(!user) {
            return res.status(400).json({message: "Invalid or expired reset token"})
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);;

        res.status(200).json({message : "Password reset successfully"});
    } catch (error) {
        console.log("Error in reseting password", error);
        return res.status(500).json({message: error.message});
    }
}

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("checkAuth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};