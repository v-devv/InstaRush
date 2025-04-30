import jwt from "jsonwebtoken";


const authSeller = async (req, res, next) => {
    const {sellerToken} = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            next();
        }else{
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
}

export default authSeller; 