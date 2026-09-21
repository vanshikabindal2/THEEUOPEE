import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

// MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("API is running");
});

// Authentication
app.use("/api/auth", authRoutes);

// Cart
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    console.log("JWT SECRET LOADED:", Boolean(process.env.JWT_SECRET));

});