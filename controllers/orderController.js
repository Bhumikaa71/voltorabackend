const Order = require("../models/Order");
const User = require("../models/User");

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart
      .filter((c) => c.product)
      .map((c) => ({
        product: c.product._id,
        title: c.product.title,
        image: c.product.images?.[0] || "",
        price: c.product.price,
        quantity: c.quantity,
      }));

    if (!items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 199 ? 0 : 9.99;
    const total = subtotal + shipping;
    const method = paymentMethod === "ESEWA" ? "ESEWA" : "COD";

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress: shippingAddress || {},
      paymentMethod: method,
      paymentStatus: "Pending",
      status: "Pending",
    });

    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};