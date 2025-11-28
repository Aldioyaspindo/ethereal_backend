// controllers/catalogController.js
import Catalog from "../models/catalogModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

const catalogController = {
  // CREATE
  async createCatalog(req, res) {
    try {
      const {
        productName,
        productPrice,
        productColor,
        productSize,
        productTotal,
        productDescription,
      } = req.body;

      // Validasi data wajib
      if (!productName || !productPrice) {
        return res.status(400).json({
          success: false,
          message: "Nama produk dan harga wajib diisi",
        });
      }

      // Ambil URL dan Public ID dari Cloudinary
      const productImageURL = req.file
        ? req.file.path
        : req.body.productImage || null;
      const imagePublicId = req.file ? req.file.filename : null;

      const newCatalog = new Catalog({
        productName,
        productPrice,
        productColor,
        productSize,
        productDescription,
        productTotal,
        productImage: productImageURL,
        imagePublicId: imagePublicId,
      });

      await newCatalog.save();

      console.log("Catalog berhasil dibuat:", newCatalog);

      res.status(201).json({
        success: true,
        message: "Catalog berhasil ditambahkan",
        data: newCatalog,
      });
    } catch (error) {
      console.error("❌ Create Catalog Error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Gagal menambahkan catalog",
      });
    }
  },

  // GET ALL
  async getAllCatalog(req, res) {
    try {
      const catalogs = await Catalog.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua catalog",
        data: catalogs,
      });
    } catch (error) {
      console.error("❌ Get All Catalog Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Gagal mengambil data catalog",
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
        message: "Berhasil mengambil catalog",
        data: catalog,
      });
    } catch (error) {
      console.error("❌ Get Catalog By ID Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Gagal mengambil catalog",
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

      // Validasi data wajib jika diubah
      if (req.body.productName && req.body.productName.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Nama produk tidak boleh kosong",
        });
      }

      const updateData = { ...req.body };

      // Jika ada file baru diupload
      if (req.file) {
        // 1. Hapus gambar lama dari Cloudinary
        if (catalog.imagePublicId) {
          try {
            await cloudinary.v2.uploader.destroy(catalog.imagePublicId);
            console.log("Gambar lama dihapus dari Cloudinary:", catalog.imagePublicId);
          } catch (deleteError) {
            console.error("Gagal hapus gambar lama:", deleteError.message);
            // Lanjutkan meskipun gagal hapus file lama
          }
        }

        // 2. Set data gambar baru
        updateData.productImage = req.file.path; // URL Cloudinary baru
        updateData.imagePublicId = req.file.filename; // Public ID baru

      }

      const updatedCatalog = await Catalog.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      console.log("Update berhasil:", updatedCatalog);

      res.status(200).json({
        success: true,
        message: "Catalog berhasil diupdate",
        data: updatedCatalog,
      });
    } catch (error) {
      console.error("❌ Update Catalog Error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Gagal update catalog",
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

      // Hapus gambar dari Cloudinary jika ada Public ID
      if (catalog.imagePublicId) {
        try {
          await cloudinary.v2.uploader.destroy(catalog.imagePublicId);
          console.log("🗑️ Gambar dihapus dari Cloudinary:", catalog.imagePublicId);
        } catch (deleteError) {
          console.error("⚠️ Gagal hapus gambar dari Cloudinary:", deleteError.message);
          // Lanjutkan untuk hapus dari database
        }
      }

      // Hapus dari database
      await Catalog.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Catalog berhasil dihapus",
        data: catalog,
      });
    } catch (error) {
      console.error("❌ Delete Catalog Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Gagal menghapus catalog",
      });
    }
  },
};

export default catalogController;