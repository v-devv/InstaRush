
// place order COD : /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCod = async (req , res)=>{
    try {
        const { userId , items , address} = req.body;
        if(!address || items.length === 0){
            return res.json({success:false , message : "Invalid Data"} );

        }
        //Calculate Amount using Items
        let amount = await items.reduce(async (acc , item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;

        } , 0 );
        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType : "COD"
        });
        return res.json({ success : true , message : "Order Placed Successfully " , amount})

    } catch (error) {
        return res.json({ success : false , message : error.message})
    }
}

//get orders by user Id : /api/order/user

export const getUserOrders = async (req , res)=>{
    try {
        const  userId = req.userId;
        const orders = await Order.find({
            userId ,
            $or : [{paymentType : "COD"} , {isPaid:true}]
        }).populate("items.product address").sort({createdAt : -1})
        res.json({success: true , orders})
    } catch (error) {
        res.json({success :false , message :error.message})
    }
}
export const getAllOrders = async (req , res)=>{
    try {
        const orders = await Order.find({
            $or : [{paymentType : "COD"} , {isPaid:true}]
        }).populate("items.product address").sort({createdAt : -1})
        res.json({success: true , orders})
    } catch (error) {
        res.json({success :false , message :error.message})
    }
}