import asyncHandler from "express-async-handler";
import Ticket from "../models/ticketModel.js";
import TicketReply from "../models/ticketReply.js";
import { sendEmail } from "../config/mailer.js";
import cloudinary from "../config/cloudinary.js";


export const getTickets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tickets = await Ticket.find({ userId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(tickets);
});

export const createTicket = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = req.user; // contains name + email

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
    userId,
  });

  try {
    // ADMIN NOTIFICATION EMAIL
    await sendEmail(
      "noreply@rewipay.com", // change email as per requirement
      `New Ticket Created by ${user.name}`,
      `
A new support ticket has been created.

User Name: ${user.name}
User Email: ${user.email}

Subject: ${ticket.subject}
Description: ${ticket.description}
Priority: ${ticket.priority}
Type: ${ticket.type || "N/A"}
Channel: ${ticket.channel || "N/A"}

Created At: ${ticket.createdAt}

Please check the admin dashboard to respond.
`
    );

    // USER CONFIRMATION EMAIL
    await sendEmail(
      user.email,
      "Your Ticket Has Been Received - RewiPay Support",
      `
Hello ${user.name},

Your support ticket has been received successfully.

📝 Ticket Details:
Subject: ${ticket.subject}
Priority: ${ticket.priority}
Type: ${ticket.type || "N/A"}

⏳ Our team will respond within 24 hours.

Thank you,
RewiPay Support Team
`
    );

  } catch (error) {
    console.error("Email sending error:", error);
  }

  res.status(201).json({
    message: "Ticket created successfully. Email notifications sent.",
    ticket,
  });
});

export const getSingleTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("userId", "name email");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  const replies = await TicketReply.find({ ticketId: req.params.id })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.json({ ticket, replies });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const ticket = await Ticket.findOne({ _id: req.params.id, userId });

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Agar ticket me image URL saved hai to Cloudinary se delete karo
  if (ticket.imagePublicId) {
    await cloudinary.uploader.destroy(ticket.imagePublicId);
  }
  await ticket.deleteOne();
  // Delete replies too
  await TicketReply.deleteMany({ ticketId: req.params.id });

  res.json({ message: "Ticket deleted successfully", id: req.params.id });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["open", "pending", "resolved", "closed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  res.json(ticket);
});

export const addReply = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const reply = await TicketReply.create({
    ticketId: req.params.id,
    sender: req.user._id,
    senderType: req.user.role === "admin" ? "admin" : "user",
    message,
    image: req.file ? req.file.path : null,
  });

  res.status(201).json(reply);
});

export const getReplies = asyncHandler(async (req, res) => {
  const replies = await TicketReply.find({ ticketId: req.params.id })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.json(replies);
});


