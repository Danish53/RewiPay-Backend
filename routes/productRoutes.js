// routes/userProductRoutes.js
import express from 'express';
import { getAllProducts, getSingleProduct } from '../controllers/productsController.js';
const router = express.Router();

// Public Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getSingleProduct);

export default router;
