import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendOtpToEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(201)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(res, user._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { email: user.email, name: user.name },
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// check is authenticated or not
export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId", userId);
    const user = await User.findById(userId).select("-password");

    return res
      .status(200)
      .json({ success: true, message: "User found", user: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
//logout userController
export const logout = async (req, res) => {
  try {

    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginWithOTP = async (req, res) => {
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASSWORD);
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

    // if user not registered
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered. Please register first",
      });
    }

    const currentTime = parseInt(new Date().getTime() / 1000);

    //prevent multiple OTP requests
    if (user.OTPExpiry && user.OTPExpiry > currentTime) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please try again later",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const OTPExpiry = currentTime + 5 * 60;

    await sendOtpToEmail(email, OTP);
    const hashedOTP = await bcrypt.hash(OTP.toString(), 10);

    console.log("OTP sent successfully:", OTP);

    user.OTP = hashedOTP;
    user.OTPExpiry = OTPExpiry;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error.message, "Error in login with OTP");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// verify OTP and login
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.OTP || !user.OTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP already used or expired. Please request a new OTP.",
      });
    }

    const currentTime = parseInt(new Date().getTime() / 1000);

    const isOTPValid = await bcrypt.compare(otp.toString(), user.OTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.OTPExpiry < currentTime) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.OTP = null;
    user.OTPExpiry = null;

    await user.save();

    const token = generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
