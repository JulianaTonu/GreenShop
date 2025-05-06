
import jwt from 'jsonwebtoken';



console.log("JWT_SECRET34:", process.env.JWT_SECRET);

const authUser = async (req, res, next) => {
    const { token } = req.cookies
    console.log("User Token:", token);

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized: No token",
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("tokenDecode:", tokenDecode.id);

        if (tokenDecode.id) {
            req.user = tokenDecode.id;
        } else {
            return res.json({
                success: false, message: "not Authorized"
            })
        }
        next();
    } catch (error) {
        console.log("isAuth error:", error.message);

        return res.json({
            success: false, message: "not Authorized"
        })
    }
}

export default authUser;