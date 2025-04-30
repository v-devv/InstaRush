
//seller login
// api/seller/login
import jwt from 'jsonwebtoken';

export const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" })
            if (!token) {
                return res.status(400).json({ success: false, message: "Invalid credentials" })
            }
            res.cookie("sellerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });
            return res.status(200).json({ success: true, message: "Logged in successfully" })
        }
        else {
            return res.status(201).json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}

// check is authenticated or not
// api/seller/is-auth
export const isSellerAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "Seller is authenticated" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// logout
// api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}