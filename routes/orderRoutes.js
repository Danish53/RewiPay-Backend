import express from 'express';
import { createOrder, getOrdersByUser } from '../controllers/orderController.js';

const router = express.Router();

router.post('/marketplace-orders', createOrder);
router.get("/orders/:userId", getOrdersByUser);

export default router;