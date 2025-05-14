import express from 'express';
import { addAddress, deleteAddress, getAddress } from '../controllers/addressController.js';
import authUSer from '../middlewares/authUser.js';


const addressRouter = express.Router();

addressRouter.post('/add', authUSer, addAddress);
addressRouter.get('/get', authUSer, getAddress);
addressRouter.put('/delete', authUSer, deleteAddress);

export default addressRouter;

