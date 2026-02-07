import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, updateOrderStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
import { markCODPaymentReceived } from "../controllers/orderController.js";
import { cancelOrderByUser } from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.patch("/user-cancel/:orderId", authUser, cancelOrderByUser);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.put("/mark-paid/:orderId", authSeller, markCODPaymentReceived);
orderRouter.patch("/status", authSeller, updateOrderStatus);

export default orderRouter;
