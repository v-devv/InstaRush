import express from 'express';
import mongoose from 'mongoose';
import authUSer from '../middlewares/authUser.js';
import { updateCart } from '../controllers/cartController.js';

const cartRouter = express.Router();
cartRouter.post('/update' ,authUSer , updateCart);

export default cartRouter;