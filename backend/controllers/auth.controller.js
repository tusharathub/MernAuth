import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/email.js";

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

export const login = async (req, res) => {
    res.send("Login Controller");
}

export const logout = async (req, res) => {
    res.send("Logout Controller");
}