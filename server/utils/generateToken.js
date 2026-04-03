import jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {

  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return token;
};

export default generateToken;