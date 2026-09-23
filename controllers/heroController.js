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

    // 1. Priority: File upload
    if (req.file) {
      data.image = `/uploads/hero/${req.file.filename}`;
    }
    // 2. If no file, but image URL was sent
    else if (req.body.image && req.body.image.startsWith("http")) {
      data.image = req.body.image;
    }

    // Convert string "true"/"false" to boolean
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === "true" || data.isActive === true;
    }
    if (data.order) data.order = Number(data.order);

    // Validation: image is required
    if (!data.image) {
      return res.status(400).json({ message: "Image is required (upload or URL)" });
    }

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

    // 1. New file uploaded → delete old local file
    if (req.file) {
      if (slide.image && slide.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", slide.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      data.image = `/uploads/hero/${req.file.filename}`;
    }
    // 2. Image URL sent → use it (and delete old local file if exists)
    else if (req.body.image && req.body.image.startsWith("http")) {
      if (slide.image && slide.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", slide.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      data.image = req.body.image;
    }
    // 3. No new image → keep the existing one (don't overwrite)

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

    // Delete image file only if it is a local upload
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