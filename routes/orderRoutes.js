const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} = require("../controllers/orderController");

// User (must be logged in)
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getOrderById);

// Admin
router.get("/admin/all", getAllOrdersAdmin);
router.put("/admin/:id/status", updateOrderStatus);

module.exports = router;