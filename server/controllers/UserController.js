import dotenv from 'dotenv';
dotenv.config();
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register User: /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details,Please provide all required fields." })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.json({ success: false, message: "User Already Exists" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true, //Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookiees in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection 
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })
        return res.json({
            success: true,
            message: 'User registered successfully',
            user: {
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        console.error("Register Error:", error.message); // show main error
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: error.message // Optionally add this for more detail in the response
        });
    }

}


//Login User :/api/user/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({
                success: false,
                message: 'Email and password are required'
            });
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid email and password'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid email and password'
            });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //use secure cookiees in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection 
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })
        return res.json({
            success: true,
            message: 'User login successfully',
            user: {
                email: user.email,
                name: user.name
            }
        })


    } catch (error) {
        console.error("login Error:", error.message); // show main error
        return res.json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
}


//Check Auth: /api/user/auth
export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("user:", user);
        return res.json({ success: true, user });
    } catch (error) {
        console.log("isAuth error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


// Logout User : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
