const Product = require("../models/Product");

// GET all products (public)
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      min,
      max,
      search,
      stock,
      bestSeller,
      newArrival,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (stock) filter.stock = stock;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    if (bestSeller === "true") filter.isBestSeller = true;
    if (newArrival === "true") filter.isNewArrival = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    const cleanCategories = categories
      .filter((cat) => cat && cat.trim() !== "")
      .sort();
    res.status(200).json(cleanCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET deals
exports.getDeals = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      oldPrice: { $exists: true, $gt: 0 },
    }).sort({ createdAt: -1 });

    const deals = products.filter((p) => p.oldPrice && p.oldPrice > p.price);
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all (admin)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};