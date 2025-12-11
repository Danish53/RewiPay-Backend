import express from "express";
import { adminDashboard, adminLogin, adminLoginForm, adminLogout, createProduct, deleteProduct, editProductForm, getProducts, newProductForm, updateProduct } from "../controllers/adminController.js";

const router = express.Router();

// auth admin
router.get("/login", adminLoginForm);
// Handle login
router.post("/login", adminLogin);
// Logout
router.get("/logout", adminLogout);

// admin dahsboard
router.get("/dashboard", adminDashboard);
router.get("/products", getProducts);
router.get("/products/new", newProductForm);
router.post("/products", createProduct);
router.get("/products/:id/edit", editProductForm);
router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

export default router;
