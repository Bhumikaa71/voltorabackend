const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    stock: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    images: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    description: { type: String },
    features: [{ type: String }],
    freeShipping: { type: Boolean, default: false },
    freeGift: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    dealEndsAt: { type: Date, default: null },

    // Landing page flags
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);