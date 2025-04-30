import jwt from "jsonwebtoken";

const authUSer = async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("tokenDecode", tokenDecode);
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.status(201).json({ success: false, message: "Not authenticated" });
        }
        next();
    } catch (error) {
        console.log(error.message , " auth middleware");
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
}
export default authUSer;