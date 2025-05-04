import Product from '../models/Product.js';
import {v2 as cloudinary} from 'cloudinary'
//add product : POST /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files

        let  imagesURL = await Promise.all(
            images.map(async (image) => {
                let result = await  cloudinary.uploader.upload(image.path, {
                    resource_type: "image"})
                 
                return result.secure_url

            })

        ) 
        await Product.create({
            ...productData,
            image: imagesURL,
        })
        res.status(201).json({success : true , message: "Product added successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false , message: error.message})
    }
}
//product list : GET /api/product/list
export const getProductList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({success : true , products})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false , message: error.message})
    }
}
//single product : GET /api/product/:id
export const getSingleProduct = async (req, res) => {
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.status(200).json({success : true , product})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false , message: error.message})
    }
}
//change stock : PUT /api/product/changeStock
export const changeStock = async (req, res) => {
    try {
        const {id , inStock} = req.body
        const product = await Product.findByIdAndUpdate(id , {inStock});
        res.status(200).json({success : true , product, message: "Stock updated successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false , message: error.message})
    }
}
//delete product
export const deleteProduct = async (req , res)=>{
    try {
        const { id } = req.body;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success:false, message: 'Product not found' });
          }

        res.status(200).json({deleteProduct , success:true , message: 'Product deleted successfully'})
    } catch (error) {
        res.status(500).json({ success:false, message: 'Server Error', error });
    }
}