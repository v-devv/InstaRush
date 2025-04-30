
import express from 'express';
import authSeller from '../middlewares/authSeller.js';
import { isSellerAuthenticated, sellerLogin, sellerLogout } from '../controllers/sellerController.js';

const sellerRouter = express.Router();
sellerRouter.post('/login' ,  sellerLogin)
sellerRouter.get('/is-auth' , authSeller , isSellerAuthenticated)
sellerRouter.get('/logout' ,  sellerLogout);

export default sellerRouter;
