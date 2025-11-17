// routes/catalogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import catalogController from "../controllers/catalogController.js";

const catalogRoutes = express.Router();

// Pastikan folder uploads tersedia
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
  console.log("📂 Folder 'uploads' dibuat otomatis.");
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("File harus berupa gambar!"), false);
};

const upload = multer({ storage, fileFilter });

// ROUTES
catalogRoutes.get("/", catalogController.getAllCatalog);
catalogRoutes.get("/:id", catalogController.getCatalogById);
catalogRoutes.post("/", upload.single("productImage"), catalogController.createCatalog);
catalogRoutes.patch("/:id", upload.single("productImage"), catalogController.updateCatalog);
catalogRoutes.delete("/:id", catalogController.deleteCatalog);

// Error handler (opsional)
catalogRoutes.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default catalogRoutes;
