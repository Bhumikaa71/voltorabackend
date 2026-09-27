const User = require("../models/User");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    const items = (user.cart || [])
      .filter((c) => c.product)
      .map((c) => ({
        id: c.product._id.toString(),
        title: c.product.title,
        price: c.product.price,
        oldPrice: c.product.oldPrice,
        image: c.product.images?.[0] || "",
        stock: c.product.stock,
        quantity: c.quantity,
      }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    const existing = user.cart.find(
      (c) => c.product.toString() === productId
    );
    if (existing) {
      existing.quantity += Number(quantity) || 1;
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) || 1 });
    }
    await user.save();
    res.status(200).json({ message: "Added to cart" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((c) => c.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      user.cart = user.cart.filter((c) => c.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await user.save();
    res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((c) => c.product.toString() !== productId);
    await user.save();
    res.status(200).json({ message: "Removed from cart" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};