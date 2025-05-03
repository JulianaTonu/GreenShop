import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register User
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
            success:true,
            message:'User already exists',
        user:{
            email: user.email,
            name: user.name
        }
        })
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}