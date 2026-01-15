import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import sellerRouter from './routes/sellerRouter.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRouter.js';

dotenv.config();

const app = express();

// ✅ MUST be FIRST
const allowedOrigins = [
  'http://localhost:5173',
  'https://insta-rush-front.vercel.app',
  'https://www.instarush.store'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ MUST be BEFORE routes
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// connect DB & cloudinary ONCE
await connectDB();
await connectCloudinary();

app.get('/', (req, res) => {
  res.send('Server started successfully!');
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;
