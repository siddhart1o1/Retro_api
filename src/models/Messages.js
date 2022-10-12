const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", MessagesSchema);
