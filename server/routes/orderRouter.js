
import express from "express";
import authUSer from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCod } from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post('/cod' , authUSer ,placeOrderCod );
orderRouter.get('/get-user-order' , authUSer , getUserOrders);
orderRouter.get('/get-all-orders' , authSeller , getAllOrders);


export default orderRouter;