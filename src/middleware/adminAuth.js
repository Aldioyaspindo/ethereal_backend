// src/middleware/adminAuth.js (Pastikan jwt diimpor)

import jwt from "jsonwebtoken";
import UserAdmin from "../models/userAdminModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    // 1. BACA DARI COOKIE
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: "Admin token tidak ditemukan." }); // 401
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await UserAdmin.findById(decoded.id).select("-password");
    if (!admin) {
      // Token valid, tapi user tidak ada di DB
      return res.status(403).json({ message: "Hanya admin yang boleh akses" });
    } // 2. Periksa Role

    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Akses Ditolak: Role bukan admin." });
    }

    req.user = admin;
    next();
  } catch (error) {
    // Kegagalan Verifikasi JWT (Expired, Invalid Signature)
    return res.status(401).json({ message: "Token invalid atau expired." });
  }
};
