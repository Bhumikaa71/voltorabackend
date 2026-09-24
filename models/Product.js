const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    brand: { type: String, default: "" },
    stock: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    images: [{ type: String }], // array of image URLs
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    description: { type: String, default: "" },
    features: [{ type: String }],
    freeShipping: { type: Boolean, default: false },
    freeGift: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);