import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userCustomerRouter from "./routes/userCustomerRoute.js";
import userAdminRoute from "./routes/userAdminRoute.js";
import articleRoutes from "./routes/articleRoutes.js";
import catalogRoutes from "./routes/catalogRoute.js";
import feedbackRoute from "./routes/feedbackRoutes.js";
import keranjangrouter from "./routes/keranjangRoute.js";
import PortofolioRouter from "./routes/portofolioRoute.js"

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ===== Uploads Folder Setup =====
const uploadsPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("Folder 'uploads' dibuat otomatis di:", uploadsPath);
}

// ===== Static Files =====
app.use("/uploads", express.static(uploadsPath));

// ========================================
// MIDDLEWARE - URUTAN INI SANGAT PENTING!
// ========================================

// 1. Cookie Parser HARUS PALING ATAS
app.use(cookieParser());

// 2. CORS Configuration (HANYA 1 KALI!)
app.use(
  cors({
    origin: FRONTEND_URL, // Frontend URL
    credentials: true, // WAJIB untuk cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

//  3. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  4. Morgan Logger (development only)
if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

//  5. Debug Middleware (untuk troubleshooting

// ========================================
// ROUTES
// ========================================
app.use("/api/admin", userAdminRoute);
app.use("/customer", userCustomerRouter);
app.use("/articles", articleRoutes);
app.use("/catalogs", catalogRoutes);
app.use("/feedbacks", feedbackRoute);
app.use("/cart", keranjangrouter);
app.use("/portofolio", PortofolioRouter);

// Test route
app.get("/test", (req, res) => {
  res.json({
    message: "Server is running",
    cookies: req.cookies,
  });
});

// ========================================
// ERROR HANDLERS
// ========================================

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

export default app;