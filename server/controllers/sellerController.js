import jwt from "jsonwebtoken"

//Login Seller :/api/seller/login

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', //use secure cookiees in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection 
                maxAge: 7 * 24 * 60 * 60 * 1000,

            });
            return res.json({ success: true, message: "Logged In" })
        } else {
            return res.json({ success: false, message: "Invalid Credentials" })

        }
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: "Invalid Credentials" })
    }
}

//Seller Auth: /api/seller/auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.status(404).json({ success: false, message: "User not found" });
    } catch (error) {
        console.log("isAuth error:", error.message);
        return res.json({ success: false, message: error.message });
    }
}


// Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
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
