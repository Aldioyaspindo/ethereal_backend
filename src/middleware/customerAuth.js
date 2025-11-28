import jwt from "jsonwebtoken"; // Pastikan Anda mengimpor jwt
import UserCustomer from "../models/userCustomerModel.js";

export const customerAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 1. Jika token hilang -> 401 Unauthorized (Perbaikan)
    if (!token) {
      return res.status(401).json({
        success: false,
        requireAuth: true,
        message:
          "Akses Ditolak. Anda harus login untuk melihat keranjang belanja Anda.",
      });
    }

    // 2. Verifikasi Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Cari User (Jika User terhapus, anggap 401 karena tidak bisa diverifikasi)
    const customer = await UserCustomer.findById(decoded.id).select(
      "-password"
    );
    if (!customer) {
      return res
        .status(401)
        .json({ message: "Sesi tidak valid: Pengguna tidak ditemukan." });
    }

    // 4. Periksa Role (Opsional, tapi penting jika Anda punya role lain selain customer)
    if (decoded.role !== "customer") {
      // Jika token valid tapi role salah -> 403 Forbidden (Otorisasi Gagal)
      return res
        .status(403)
        .json({ message: "Akses Ditolak: Role bukan customer." });
    }

    req.user = customer;
    next();
  } catch (error) {
    // 5. Kegagalan Verifikasi JWT (Token expired/invalid signature) -> 401 Unauthorized (Perbaikan)
    return res.status(401).json({
      success: false,
      message:
        "Akses Ditolak. Anda harus login untuk melihat keranjang belanja Anda.",
      error: error.message,
    });
  }
};
