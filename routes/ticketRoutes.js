import express from "express";
import {
    getTickets,
    createTicket,
} from "../controllers/ticketController.js";
import upload from "../middlewares/upload.js";
import { deleteTicket } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/tickets", getTickets);
router.post("/ticket", upload.single("image"), createTicket);
router.delete("/ticket/:id", deleteTicket);

export default router;
