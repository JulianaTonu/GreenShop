
const authSeller =async(req,res,next)=>{
const {sellerToken} =req.cookies;

if(!sellerToken){
   return res.json({success:false, message:'Not authorized'})
}

  try {
        const tokenDecode = jwt.verify(sellerToken,process.env.JWT_SECRET)
        // console.log("tokenDecode:", tokenDecode.id);

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({
                success: false, message: "not Authorized"
            })
        }
       
    } catch (error) {
        console.log("isAuth error:", error.message);

        return res.json({
            success: false, message: "not Authorized"
        })
    }

}

export default authSeller;