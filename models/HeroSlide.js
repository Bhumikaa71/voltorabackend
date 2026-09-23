const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "Shop Now",
    },
    buttonLink: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL of the image
      required: true,
    },
    bg: {
      type: String,
      default: "bg-gradient-to-br from-[#0B1D36] to-[#132B4A]",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);