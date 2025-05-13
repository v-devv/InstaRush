import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, deleteProduct, editProduct, getProductList, getSingleProduct } from '../controllers/productController.js';


const productRouter = express.Router();


productRouter.post('/add', upload.array(['images']), authSeller, addProduct);
productRouter.get('/list' ,  getProductList );
productRouter.get('/id' , getSingleProduct );
productRouter.put('/stock' , authSeller , changeStock );
productRouter.delete('/delete'  , deleteProduct );
productRouter.put('/edit'  , editProduct );
export default productRouter;