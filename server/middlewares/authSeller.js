import jwt from 'jsonwebtoken';

const authSeller =async(req,res,next)=>{
const {sellerToken} =req.cookies;
console.log("seller:", sellerToken);

if(!sellerToken){
   return res.json({success:false, message:'Not authorized'})
}

  try {
        const tokenDecode = jwt.verify(sellerToken,process.env.JWT_SECRET)
        console.log("seller:", tokenDecode);

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({
                success: false, message: "not Authorized"
            })
        }
       
    } catch (error) {
        console.log("isAuth error:", error.message);

        return res.status(401).json({ success: false, message: 'Not authorized' });

    }

}

export default authSeller;