const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
