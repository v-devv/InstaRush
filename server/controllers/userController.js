import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ success: false , message: "Please fill all the fields" })
        }
        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(201).json({success : false , message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password : hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, {
            httpOnly: true, // Set the cookie to HTTP only and prevent client-side JavaScript from accessing it 
            secure: process.env.NODE_ENV === "production" , // Set to true in production to ensure the cookie is only sent over HTTPS
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict" ,// Set to "none" in production to allow cross-site requests, otherwise "strict" for same-site requests
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        return res.status(201).json({ success: true, message: "User created successfully" , user: { email : user.email , name : user.name  } });
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(201).json({ success: false , message: "Please fill all the fields" })
        }
        const user = await User.findOne({ email });
        console.log("user" , user);
        if(!user){
            return res.status(201).json({success : false , message: "Invalid credentials" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(201).json({success : false , message: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, {
            httpOnly: true, // Set the cookie to HTTP only and prevent client-side JavaScript from accessing it 
            secure: process.env.NODE_ENV === "production" , // Set to true in production to ensure the cookie is only sent over HTTPS
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict" ,// Set to "none" in production to allow cross-site requests, otherwise "strict" for same-site requests
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        return res.status(200).json({ success: true, message: "Logged in successfully" , user: { email : user.email , name : user.name  } , token : token });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// check is authenticated or not
export const checkAuth = async (req, res) => {
    try {
        const userId  = req.userId;
        console.log("userId"  , userId)
        const user = await User.findById(userId).select("-password");
      
        return res.status(200).json({ success: true, message: "User found", user: user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message:error.message , success:false });
    }
}
//logout userController
export const logout = async (req, res) => {
    try {
        res.clearCookie("token" , {
            httpOnly: true, // Set the cookie to HTTP only and prevent client-side JavaScript from accessing it
        secure: process.env.NODE_ENV === "production " , // Set to true in production to ensure the cookie is only sent over HTTPS
        sameSite:process.env.NODE_ENV === "production" ? "none" : "strict"
        
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
        
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}