const HeroSlide = require("../models/HeroSlide");
const path = require("path");
const fs = require("fs");

// Get all active slides (frontend)
exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all slides (admin)
exports.getAllHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create slide
exports.createHeroSlide = async (req, res) => {
  try {
    const data = { ...req.body };

    // If a file was uploaded
    if (req.file) {
      data.image = `/uploads/hero/${req.file.filename}`;
    }

    // Convert string "true"/"false" to boolean
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === "true" || data.isActive === true;
    }
    if (data.order) data.order = Number(data.order);

    const slide = await HeroSlide.create(data);
    res.status(201).json(slide);
  } catch (error) {
    // Delete uploaded file if creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Update slide
exports.updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    const data = { ...req.body };

    // If new image uploaded → delete old one
    if (req.file) {
      if (slide.image && slide.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", slide.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      data.image = `/uploads/hero/${req.file.filename}`;
    }

    if (data.isActive !== undefined) {
      data.isActive = data.isActive === "true" || data.isActive === true;
    }
    if (data.order) data.order = Number(data.order);

    const updated = await HeroSlide.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete slide
exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    // Delete image file
    if (slide.image && slide.image.startsWith("/uploads/")) {
      const imagePath = path.join(__dirname, "..", slide.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await slide.deleteOne();
    res.status(200).json({ message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};