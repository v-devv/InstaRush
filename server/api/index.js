import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from '../configs/db.js';
import connectCloudinary from '../configs/cloudinary.js';

import userRouter from '../routes/userRouter.js';
import sellerRouter from '../routes/sellerRouter.js';
import productRouter from '../routes/productRoute.js';
import cartRouter from '../routes/cartRoute.js';
import addressRouter from '../routes/addressRoute.js';
import orderRouter from '../routes/orderRouter.js';

dotenv.config();

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://insta-rush-front.vercel.app',
  'https://www.instarush.store',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/* ❌ DO NOT use app.options('*') */

/* ============== MIDDLEWARES ============== */
app.use(express.json());
app.use(cookieParser());

/* ============== DB & CLOUDINARY ============== */
await connectDB();
await connectCloudinary();

/* ============== ROUTES ============== */
app.get('/', (req, res) => {
  res.send('Server running successfully 🚀');
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;
