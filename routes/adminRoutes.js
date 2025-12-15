import express from "express";
import { addReplyAdmin, adminDashboard, adminLogin, adminLoginForm, adminLogout, createProduct, createRewardLevel, deleteProduct, editProductForm, getProducts, getRepliesAdmin, getRewardLevels, getTicketsAll, newProductForm, updateProduct, updateTicketStatus } from "../controllers/adminController.js";
import upload from "../middlewares/upload.js";
import { isAdmin } from "../middlewares/authAdmin.js";
import RewardLevel from "../models/RewardLevel.js";

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
router.post("/products", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 }
]), createProduct);
router.get("/products/:id/edit", editProductForm);
router.put("/products/:id", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 }
]), updateProduct);

router.delete("/products/:id", deleteProduct);

// tickets
router.get("/tickets", getTicketsAll);
// View single ticket
router.get("/ticket/:id", async (req, res) => {
    const Ticket = (await import("../models/ticketModel.js")).default;
    const TicketReply = (await import("../models/ticketReply.js")).default;

    const ticket = await Ticket.findById(req.params.id).populate("userId", "name email");
    const replies = await TicketReply.find({ ticketId: req.params.id })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

    const token = req.cookies.adminToken; // Get token from cookie
    res.render("ticketView", { ticket, replies, adminToken: token });
});

// Update ticket status
router.put("/tickets/:id/status", isAdmin, updateTicketStatus);

// Add admin reply
router.post("/tickets/:id/reply", isAdmin, upload.single("image"), addReplyAdmin);

// Get replies (optional API)
router.get("/tickets/:id/replies", isAdmin, getRepliesAdmin);

// rewards
router.get("/rewards", isAdmin, async (req, res) => {
    const levels = await RewardLevel.find().sort({ startAmount: 1 });
    res.render("rewards", {
        levels,
        adminToken: req.token
    });
});
router.post("/rewards/levels", isAdmin, createRewardLevel);
router.get("/rewards/levels", isAdmin, getRewardLevels);

export default router;
