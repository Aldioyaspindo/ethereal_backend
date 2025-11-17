import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    JudulArtikel: {
      type: String,
      required: [true, "Judul artikel wajib diisi."],
      trim: true,
      minlength: [5, "Judul minimal 5 karakter."],
      maxlength: [200, "Judul maksimal 200 karakter."],
    },
    IsiArtikel: {
      type: String,
      required: [true, "Isi artikel wajib diisi."],
      minlength: [20, "Isi artikel minimal 20 karakter."],
    },
    ImageUrl: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          // Validasi URL gambar sederhana
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: (props) => `${props.value} bukan URL gambar yang valid.`,
      },
    },
  },
  {
    timestamps: true, // otomatis tambahkan createdAt & updatedAt
    versionKey: false,
    collection: "artikels",
  }
);

articleSchema.index({ JudulArtikel: "text" });

articleSchema.methods = {
  async updateArtikel(data) {
    Object.assign(this, data);
    return this.save();
  },
  async deleteArtikel() {
    return this.deleteOne();
  },
};

// Middleware logging
articleSchema.pre("save", function (next) {
  console.log(`[Artikel] "${this.JudulArtikel}" akan disimpan.`);
  next();
});

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;
