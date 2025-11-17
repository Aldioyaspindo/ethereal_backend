// controllers/catalogController.js
import Catalog from "../models/catalogModel.js";
import fs from "fs";
import path from "path";

const catalogController = {
  // CREATE
  async createCatalog(req, res) {
    try {
      const { productName, productPrice, productColor, productSize, productTotal, productDescription } = req.body;

      // ✅ Ambil path gambar dari upload atau URL manual
      const productImage = req.file 
        ? `uploads/${req.file.filename}` // 
        : req.body.productImage || null;

      const newCatalog = new Catalog({
        productName,
        productPrice,
        productColor,
        productSize,
        productDescription,
        productTotal,
        productImage,
      });

      await newCatalog.save();

      res.status(201).json({
        success: true,
        message: "Catalog berhasil ditambahkan",
        data: newCatalog,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET ALL
  async getAllCatalog(req, res) {
    try {
      const catalogs = await Catalog.find();
      res.status(200).json({
        success: true,
        data: catalogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET BY ID
  async getCatalogById(req, res) {
    try {
      const catalog = await Catalog.findById(req.params.id);
      if (!catalog) {
        return res.status(404).json({
          success: false,
          message: "Catalog tidak ditemukan",
        });
      }
      res.status(200).json({
        success: true,
        data: catalog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // UPDATE
  async updateCatalog(req, res) {
    try {
      const catalog = await Catalog.findById(req.params.id);
      if (!catalog) {
        return res.status(404).json({
          success: false,
          message: "Catalog tidak ditemukan",
        });
      }

      // Jika ada file baru diupload
      if (req.file) {
        // Hapus gambar lama jika ada
        if (catalog.productImage && catalog.productImage.startsWith("uploads/")) {
          const oldImagePath = path.join(process.cwd(), catalog.productImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("🗑️ Gambar lama dihapus:", oldImagePath);
          }
        }
        req.body.productImage = `uploads/${req.file.filename}`;
      }

      const updatedCatalog = await Catalog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Catalog berhasil diupdate",
        data: updatedCatalog,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // DELETE
  async deleteCatalog(req, res) {
    try {
      const catalog = await Catalog.findById(req.params.id);
      if (!catalog) {
        return res.status(404).json({
          success: false,
          message: "Catalog tidak ditemukan",
        });
      }

      // Hapus gambar dari server jika ada
      if (catalog.productImage && catalog.productImage.startsWith("uploads/")) {
        const imagePath = path.join(process.cwd(), catalog.productImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("🗑️ Gambar dihapus:", imagePath);
        }
      }

      await Catalog.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Catalog berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default catalogController;