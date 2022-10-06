const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    images: { type: Array },
    category: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "active" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
