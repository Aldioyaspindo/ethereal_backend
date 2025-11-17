import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import articleRoutes from "./routes/articleRoutes.js";
import catalogRoutes from "./routes/catalogRoute.js";
import feedbackRoute from "./routes/feedbackRoutes.js";
import Cartrouter from "./routes/keranjangRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Uploads Folder Setup =====
const uploadsPath = path.join(__dirname, "../uploads"); // jika folder uploads di luar src

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📂 Folder 'uploads' dibuat otomatis di:", uploadsPath);
}

// ===== Static Files =====
app.use("/uploads", express.static(uploadsPath));
console.log("✅ Static uploads path aktif di:", uploadsPath);

// ===== Middleware umum =====
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ===== Routes =====
app.use("/users", userRoute);
app.use("/articles", articleRoutes);
app.use("/catalogs", catalogRoutes);
app.use("/feedbacks", feedbackRoute);
app.use("/cart", Cartrouter);

// ===== 404 Handler =====
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ===== Jalankan Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
