import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "../server/configs/db.js";
import connectCloudinary from "../server/configs/cloudinary.js";

import userRouter from "../server/routes/userRouter.js";
import sellerRouter from "../server/routes/sellerRouter.js";
import productRouter from "../server/routes/productRoute.js";
import cartRouter from "../server/routes/cartRoute.js";
import addressRouter from "../server/routes/addressRoute.js";
import orderRouter from "../server/routes/orderRouter.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

await connectDB();
await connectCloudinary();

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

export default app;
