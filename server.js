const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const heroRoutes = require("./routes/heroRoutes");
const path = require("path");

app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/hero", heroRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/products", require("./routes/productRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Voltora Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});