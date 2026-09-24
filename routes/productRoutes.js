const express = require("express");
const router = express.Router();
const {
  getProducts,
  getCategories,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ========== PUBLIC ROUTES ==========
router.get("/", getProducts);
router.get("/categories", getCategories); // ← must be before /:id

// ========== ADMIN ROUTES ==========
router.get("/admin/all", getAllProductsAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// ========== DYNAMIC ROUTE (MUST BE LAST) ==========
router.get("/:id", getProductById);

module.exports = router;