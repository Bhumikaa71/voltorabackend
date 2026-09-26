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

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/deals", getDeals);

router.get("/admin/all", getAllProductsAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/:id", getProductById);

module.exports = router;