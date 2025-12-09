import express from 'express';
import { createOrder, getOrderById, getOrdersByUser } from '../controllers/orderController.js';

const router = express.Router();

router.post('/marketplace-orders', createOrder);
router.get("/orders/:userId", getOrdersByUser);
router.get("/order/:orderId", getOrderById);

export default router;