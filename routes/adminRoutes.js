import express from "express";
import { adminDashboard, createProduct, deleteProduct, editProductForm, getProducts, newProductForm, updateProduct } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", adminDashboard);

router.get("/products", getProducts);
router.get("/products/new", newProductForm);
router.post("/products", createProduct);

router.get("/products/:id/edit", editProductForm);
router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

export default router;
