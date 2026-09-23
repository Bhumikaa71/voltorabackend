const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getHeroSlides,
  getAllHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroController");

// Public
router.get("/", getHeroSlides);

// Admin
router.get("/admin", getAllHeroSlides);
router.post("/", upload.single("image"), createHeroSlide);
router.put("/:id", upload.single("image"), updateHeroSlide);
router.delete("/:id", deleteHeroSlide);

module.exports = router;