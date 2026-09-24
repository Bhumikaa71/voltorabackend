const express = require("express");
const router = express.Router();
const {
  getProducts,
  getCategories,
  getDeals,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ========== PUBLIC ROUTES ==========
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/deals", getDeals);

// ========== ADMIN ROUTES ==========
router.get("/admin/all", getAllProductsAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// ========== DYNAMIC ROUTE (MUST BE LAST) ==========
router.get("/:id", getProductById);

module.exports = router;