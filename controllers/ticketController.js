import asyncHandler from "express-async-handler";
import Ticket from "../models/ticketModel.js";

// GET all tickets
export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.json(tickets);
});

// POST create ticket
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, agent, priority, type, channel, tags } = req.body;

  if (!subject || !description) {
    res.status(400);
    throw new Error("Subject and Description are required");
  }

  const ticket = await Ticket.create({
    subject,
    description,
    agent,
    priority,
    type,
    channel,
    tags: tags ? tags.split(",").map(t => t.trim()) : [],
    image: req.file ? req.file.path : null,
  });

  res.status(201).json(ticket);
});

// DELETE /api/tickets/:id
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Agar ticket me image URL saved hai to Cloudinary se delete karo
  if (ticket.imagePublicId) {
    await cloudinary.uploader.destroy(ticket.imagePublicId);
  }

  await ticket.deleteOne();

  res.json({ message: "Ticket deleted successfully", id: req.params.id });
});
