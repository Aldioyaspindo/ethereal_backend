import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name wajib diisi."],
      trim: true,
    },
    productPrice: {
      type: Number,
      required: [true, "Harga wajib diisi."],
      min: [0, "Harga tidak boleh negatif."],
    },
    productColor: {
      type: String,
      required: [true, "Warna wajib diisi."],
      trim: true,
    },
    productSize: {
      type: String,
      required: [true, "Ukuran wajib diisi."],
      trim: true,
    },
    productDescription: {
      type: String,
      required: [true, "Deskripsi wajib diisi."],
      trim: true,
    },
    // DISARANKAN: Ubah ke Number jika ini adalah jumlah stok
    productTotal: { 
      type: Number, // UBAH TIPE DATA
      required: [true, "Jumlah produk harus diisi. "],
      min: [0, "Jumlah tidak boleh negatif."],
    },
    productImage: {
      type: String, 
      trim: true,
      default: null,
      // ❌ HAPUS VALIDATOR LAMA YANG MENGATUR PATH LOKAL
      // Validator ini akan memblokir URL Cloudinary
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "catalogs",
  }
);

const Catalog = mongoose.model("Catalog", catalogSchema);

export default Catalog;