
import { v4 as uuidv4 } from "uuid";
import Product from "../models/Product.js";

// Dashboard
export const adminDashboard = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const latest = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.render("dashboard", { totalProducts, latest });
};

// List products
export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render("products", { products });
};

// Show create form
export const newProductForm = (req, res) => {
  res.render("product_form", {
    product: null,
    action: "/admin/products",
    method: "POST",
  });
};

// Create product
export const createProduct = async (req, res) => {
  try {
    if (!req.body.id) req.body.id = uuidv4();

    if (typeof req.body.features === "string")
      req.body.features = req.body.features.split(",").map((x) => x.trim());

    if (typeof req.body.images === "string")
      req.body.images = req.body.images.split(",").map((x) => x.trim());

    await Product.create(req.body);
    res.redirect("/admin/products");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Edit form
export const editProductForm = async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.redirect("/admin/products");

  res.render("product_form", {
    product,
    action: `/admin/products/${product.id}?_method=PUT`,
    method: "POST",
  });
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    if (typeof req.body.features === "string")
      req.body.features = req.body.features.split(",").map((x) => x.trim());

    if (typeof req.body.images === "string")
      req.body.images = req.body.images.split(",").map((x) => x.trim());

    await Product.findOneAndUpdate({ id: req.params.id }, req.body);
    res.redirect("/admin/products");
  } catch (err) {
    res.send(err.message);
  }
};

// Delete
// Delete
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // JSON response for AJAX
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

