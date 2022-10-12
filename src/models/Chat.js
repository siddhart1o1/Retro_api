const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
