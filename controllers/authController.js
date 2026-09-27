const User = require("../models/User");
const { signToken } = require("../middleware/auth");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || {},
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || {},
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone || "",
    address: req.user.address || {},
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address?.toObject?.() || user.address, ...address };
    if (password && password.length >= 6) {
      user.password = password; // hashed by pre-save
    }

    await user.save();

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || {},
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};