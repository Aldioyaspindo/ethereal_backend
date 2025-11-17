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
    productTotal: {
      type: String,
      required: [true, "Jumlah produk harus diisi. "],
      trim: true,
    },
    productImage: {
      type: String, 
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          // hanya boleh path lokal seperti: uploads/nama_file.jpg
          return !v || /^uploads\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: (props) =>
          `${props.value} bukan path gambar lokal yang valid (harus di dalam folder uploads).`,
      },
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
