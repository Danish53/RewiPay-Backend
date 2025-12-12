import express from "express";
import {
    getTickets,
    createTicket,
    getSingleTicket,
    updateTicketStatus,
    addReply,
    getReplies,
} from "../controllers/ticketController.js";
import upload from "../middlewares/upload.js";
import { deleteTicket } from "../controllers/ticketController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/tickets", protect, getTickets);
router.post("/ticket", protect, upload.single("image"), createTicket);
router.delete("/ticket/:id", protect, deleteTicket);
router.get("/tickets/:id", protect, getSingleTicket);
router.put("/tickets/:id/status", protect, updateTicketStatus);
router.post("/tickets/:id/replies", protect, upload.single("image"), addReply);
router.get("/tickets/:id/replies", protect, getReplies);


export default router;
