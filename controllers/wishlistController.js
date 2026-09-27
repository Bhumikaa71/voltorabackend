const User = require("../models/User");
const Product = require("../models/Product");

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    const items = (user.wishlist || [])
      .filter(Boolean)
      .map((p) => ({
        id: p._id.toString(),
        title: p.title,
        price: p.price,
        oldPrice: p.oldPrice,
        image: p.images?.[0] || "",
        stock: p.stock,
        rating: p.rating,
        reviews: p.reviews,
      }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    if (!user.wishlist.some((id) => id.toString() === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};