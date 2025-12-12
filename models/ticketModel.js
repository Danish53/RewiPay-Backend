import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    agent: { type: String },
    priority: { type: String, default: "Low" },
    type: { type: String },
    channel: { type: String },
    tags: [{ type: String }], 
    image: String,
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
