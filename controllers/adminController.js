
import { v4 as uuidv4 } from "uuid";
import Product from "../models/Product.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Ticket from "../models/ticketModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import TicketReply from "../models/ticketReply.js";
import { sendEmail } from "../config/mailer.js";

// auth admin
export const adminLoginForm = (req, res) => {
  res.render("admin_login", { layout: false });
};

// Handle login

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid email or password" });

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  // Token
  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "30d" }
  );

  // Save token in cookie for server-side use
res.cookie("adminToken", token, {
  httpOnly: true, // client JS se directly accessible nahi
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: "lax", // cross-site issues avoid karne ke liye
  secure: false, // agar HTTPS nahi hai to false
});


  res.json({
    message: "Admin logged in",
    token,
    user: { id: admin._id, name: admin.name, role: admin.role },
  });
};


// Middleware to protect admin routes
export const requireAdmin = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

// Logout
export const adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};


// Dashboard
export const adminDashboard = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalTickets = await Ticket.countDocuments();
  const latest = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.render("dashboard", { totalProducts, totalTickets, latest });
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

export const createProduct = async (req, res) => {
  try {
    if (!req.body.id) req.body.id = uuidv4();

    if (req.files?.image) {
      req.body.image = req.files.image[0].path;
    }

    if (req.files?.images) {
      req.body.images = req.files.images.map((file) => file.path);
    }

    if (typeof req.body.features === "string") {
      req.body.features = req.body.features.split(",").map((x) => x.trim());
    }

    if (typeof req.body.images === "string") {
      req.body.images = req.body.images.split(",").map((x) => x.trim());
    }

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
    const oldProduct = await Product.findOne({ id: req.params.id });

    if (!oldProduct) return res.status(404).send("Product not found");

    if (typeof req.body.features === "string") {
      req.body.features = req.body.features.split(",").map((x) => x.trim());
    }

    if (req.files?.image) {
      req.body.image = req.files.image[0].path;
    } else {
      req.body.image = oldProduct.image;
    }

    let newImages = [];

    if (req.files?.images) {
      newImages = req.files.images.map((f) => f.path);
    }

    if (typeof req.body.images === "string") {
      const splitted = req.body.images.split(",").map((x) => x.trim());
      newImages = [...newImages, ...splitted];
    }

    if (newImages.length === 0) {
      newImages = oldProduct.images;
    }

    req.body.images = newImages;

    await Product.findOneAndUpdate({ id: req.params.id }, req.body);

    res.redirect("/admin/products");
  } catch (err) {
    res.send(err.message);
  }
};


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


// tickets
export const getTicketsAll = async (req, res) => {
  const tickets = await Ticket.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  // Cookie me token server se pass karo
  const token = req.cookies.adminToken;
  if(!token) {
    return alert("Session expired. Please login again.");
  }
  console.log("Admin token on tickets route:", token);

  res.render("tickets", { tickets, adminToken: token });
};



// Update ticket status
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id).populate("userId", "name email");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.status = status;
  await ticket.save();

  // Send email to user if resolved
  if (status === "resolved") {
    try {
      await sendEmail(
        ticket.userId.email,
        `Your Ticket "${ticket.subject}" has been resolved`,
        `Hello ${ticket.userId.name},

Your support ticket with subject "${ticket.subject}" has been marked as RESOLVED by our team.

Thank you for contacting support.

- RewiPay Support Team`
      );
    } catch (error) {
      console.error("Email sending failed", error);
    }
  }

  res.json({ message: "Status updated", status: ticket.status });
});

// Add admin reply
export const addReplyAdmin = asyncHandler(async (req, res) => {
  const message = req.body.message;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const reply = await TicketReply.create({
    ticketId: req.params.id,
    sender: req.user._id,
    senderType: "admin",
    message,
    image: req.file ? req.file.path : null,
  });

  res.status(201).json(reply);
});

// Get replies for a ticket
export const getRepliesAdmin = asyncHandler(async (req, res) => {
  const replies = await TicketReply.find({ ticketId: req.params.id })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.json(replies); 
});



