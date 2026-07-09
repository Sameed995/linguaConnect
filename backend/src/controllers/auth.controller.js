import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateOtp, sendOtpEmail } from "../utils/otp.js";

function setAuthCookie(req, res, userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? req.secure : false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

function sanitizeUser(user) {
    const safeUser = user.toObject ? user.toObject() : { ...user };

    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiresAt;

    return safeUser;
}



export async function signup(req, res) {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
            isEmailVerified: false,
            otpCode: otp,
            otpExpiresAt,
        });

        try {
            await sendOtpEmail({
                email: newUser.email,
                otp,
                fullName: newUser.fullName,
            });
        } catch (mailError) {
            await User.findByIdAndDelete(newUser._id);
            console.error("Error sending verification OTP:", mailError.message);
            return res.status(500).json({
                message: "Unable to send verification code. Please try again.",
            });
        }

        res.status(201).json({
            success: true,
            verificationRequired: true,
            email: newUser.email,
            message: "Account created. Check your email for the verification code.",
        });

    }   
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
}

export async function login(req, res) {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        } 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                verificationRequired: true,
                email: user.email,
            });
        }

        setAuthCookie(req, res, user._id);

         res.status(200).json({success: true, user: sanitizeUser(user)});
    }
    catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
}           

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
} 

export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            setAuthCookie(req, res, user._id);
            return res.status(200).json({
                success: true,
                message: "Email already verified",
                user: sanitizeUser(user),
            });
        }

        if (!user.otpCode || !user.otpExpiresAt) {
            return res.status(400).json({ message: "Verification code expired. Please resend it." });
        }

        if (user.otpExpiresAt.getTime() < Date.now()) {
            user.otpCode = null;
            user.otpExpiresAt = null;
            await user.save();

            return res.status(400).json({ message: "Verification code expired. Please resend it." });
        }

        if (user.otpCode !== otp) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        user.isEmailVerified = true;
        user.otpCode = null;
        user.otpExpiresAt = null;
        await user.save();

        try {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.fullName,
                image: user.profilePic || "",
            });
        } catch (streamError) {
            console.error("Error creating Stream user:", streamError.message);
        }

        setAuthCookie(req, res, user._id);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function resendOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        const otp = generateOtp();
        user.otpCode = otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOtpEmail({
            email: user.email,
            otp,
            fullName: user.fullName,
        });

        return res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email.",
        });
    } catch (error) {
        console.error("Error resending OTP:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function onboard(req, res) {
    try{
        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ message: "All fields are required", missingFields: [
                !fullName && "fullName",
                !bio && "bio",
                !nativeLanguage && "nativeLanguage",
                !learningLanguage && "learningLanguage",
                !location && "location"
            ].filter(Boolean)
         });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        try{
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        });
        console.log(`Stream user updated successfully for ${updatedUser.fullName}`);
        }catch(streamError){
            console.error('Error updating Stream user:', streamError.message);
        }

        
        res.status(200).json({ success: true, message: "Onboarding completed successfully", user: updatedUser });

        } catch (error) 
        
        {
        console.error("Error during onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
        }
}