import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register User
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.json({ success: false, message: "User Already Exists" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token, {
            httpOnly:true, //Prevent Javascript to access cookie
           
        })
    } catch (error) {
    }
}