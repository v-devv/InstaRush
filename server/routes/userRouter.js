import express from 'express';
import { checkAuth, login, logout, register } from '../controllers/userController.js';
import authUSer from '../middlewares/authUser.js';


const userRouter = express.Router();

userRouter.post('/register' , register);
userRouter.post('/login' , login); 
userRouter.get('/is-auth' , authUSer , checkAuth);
userRouter.get('/logout' , authUSer , logout)



export default userRouter; 