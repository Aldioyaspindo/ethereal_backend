import UserAdmin from "../models/userAdminModel.js";
import UserCustomer from "../models/userCustomerModel.js";
import jwt from "jsonwebtoken";

const userAdminController = {
  // Ambil semua user
  getAllUsers: async (req, res) => {
    try {
      const users = await UserAdmin.find();
      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data user",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data user",
        error: error.message,
      });
    }
  },

  // Register
  // src/controllers/userAdminController.js (Revisi Register)

  // Register
  register: async (req, res) => {
    const { username, password, role } = req.body;
    const maxAgeMs = 24 * 60 * 60 * 1000; // 1 hari

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    try {
      const existingUser = await UserAdmin.findOne({
        username: username.toLowerCase().trim(),
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username sudah terdaftar" });
      }

      const newUser = new UserAdmin({
        username: username.toLowerCase().trim(),
        password: password.trim(),
        role: role || "admin", // Default role disetel ke "admin"
      });

      await newUser.save(); // === 1. BUAT TOKEN JWT ===

      // const token = jwt.sign(
      //   { id: newUser._id, role: newUser.role },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "1d" }
      // ); // === 2. SETEL COOKIE OTENTIKASI ===

      // // Gunakan pengaturan yang konsisten untuk lingkungan development/production
      // res.cookie("adminToken", token, {
      //   httpOnly: true, // Set secure: false untuk HTTP (localhost) agar cookie tidak ditolak browser
      //   secure: process.env.NODE_ENV === "production", // Gunakan 'Lax' atau biarkan default untuk localhost, hindari 'None' di HTTP
      //   sameSite: "Lax",
      //   path: "/",
      //   maxAge: maxAgeMs,
      // });

      res.status(201).json({
        success: true,
        message: "User berhasil didaftarkan dan sesi login dibuat",
        data: {
          _id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(
        "SERVER 500 ERROR IN REGISTER:",
        error.message,
        error.stack
      );
      res.status(500).json({
        success: false,
        message: "Server error saat registrasi",
        error: error.message,
      });
    }
  },

  // Login
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    try {
      const user = await UserAdmin.findOne({
        username: username.toLowerCase().trim(),
      });
      console.log("DEBUG USER:", user);
      if (!user) {
        return res.status(400).json({ message: "User tidak ditemukan." });
      }

      const valid = await user.comparePassword(password);
      if (!valid) {
        return res.status(400).json({ message: "Password salah." });
      }

      // proses pembuatan token
      const token = jwt.sign(
        { id: user._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res
        .cookie("adminToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: "Admin login success" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error saat login",
        error: error.message,
      });
    }
  },

  userDelete: async (req, res) => {
    try {
      
      const { id } = req.params; // ID dari user yang akan dihapus
      // Ambil ID Admin yang sedang login dari req.user (disediakan oleh middleware adminAuth)
      const currentAdminId = req.user._id.toString();
      // PERBAIKAN: Cek apakah Admin sedang mencoba menghapus ID-nya sendiri
      if (id === currentAdminId) {
        return res.status(400).json({
          success: false,
          message:
            "Akses Ditolak: Anda tidak dapat menghapus akun Admin Anda sendiri.",
        });
      }

      // Jika ID berbeda, lanjutkan proses penghapusan
      const user = await UserAdmin.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      
      res.status(200).json({
        success: true,
        message: "User berhasil dihapus",
        data: user,
      });
    } catch (error) {
      console.error("Error delete user:", error.message);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus user",
        error: error.message,
      });
    }
  },

  // --- Fungsi deleteCustomer tidak memerlukan perbaikan untuk kasus self-deletion ---
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      const customer = await UserCustomer.findByIdAndDelete(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "User customer tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Berhasil menghapus user customer",
        data: customer,
      });
    } catch (error) {
      console.error("Error delete customer:", error.message);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus user customer",
        error: error.message,
      });
    }
  },
  // mengambil semua data customer
  getAllCustomer: async (req, res) => {
    try {
      const customer = await UserCustomer.find();
      res.status(200).json({
        success: true,
        message: "Berhasil Mengambil senua data user Customer",
        data: customer,
      });
    } catch (error) {
      console.error("error Get all", error.message);
      res.status(500).json({
        success: false,
        message: "Gagal Mengambil senua data user Customer",
        error: error.message,
      });
    }
  },
};

export default userAdminController;
