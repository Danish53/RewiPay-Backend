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
    image: String
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
