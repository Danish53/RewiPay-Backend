import mongoose from "mongoose";

const ticketReplySchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    image: { type: String },
    senderType: { type: String, enum: ["user", "admin"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("TicketReply", ticketReplySchema);
