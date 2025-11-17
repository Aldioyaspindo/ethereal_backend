import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userController = {
  // Ambil semua user
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data user",
        data: users,
      });
    } catch (error) {
      console.error("ERROR GET ALL:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data user",
        error: error.message,
      });
    }
  },

  // Register user baru
  register: async (req, res) => {
    const { username, password, role } = req.body;
    // --- TAMBAHKAN INI ---
    console.log("================================");
    console.log("--- DEBUG REGISTER ---");
    console.log("PASSWORD DITERIMA:", `"${password}"`);
    console.log("PASSWORD DI-TRIM:", `"${password.trim()}"`);
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    try {
      const existingUser = await User.findOne({
        username: username.toLowerCase().trim(),
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username sudah terdaftar" });
      }

      const newUser = new User({
        username: username.toLowerCase().trim(),
        password: password.trim(),
        role: role || "admin",
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User berhasil didaftarkan",
        // Kirim data yang perlu saja
        data: {
          _id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error saat registrasi",
        error: error.message,
      });
    }
  },

// Login user (PERBAIKAN FINAL)
  login: async (req, res) => {
    const { username, password } = req.body;
    
    console.log("================================");
    console.log("--- DEBUG LOGIN ---"); // <-- Typo diperbaiki
    console.log("PASSWORD DITERIMA:", `"${password}"`);
    console.log("PASSWORD DI-TRIM:", `"${password.trim()}"`);

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    try {
      const user = await User.findOne({ username: username.toLowerCase().trim() });

      console.log("Login attempt:", username);
      console.log("User from DB:", user);

      if (!user) {
        console.log("DEBUG: User tidak ditemukan.");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Gunakan password.trim()
      const isMatch = await user.comparePassword(password.trim());

      // PINDAHKAN LOG KE SINI (SEBELUM IF)
      console.log("BCRYPT MATCH?:", isMatch);
      console.log("================================");
      
      if (!isMatch) {
        console.log("DEBUG: Password tidak cocok.");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // --- Login Sukses ---
      const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "Login berhasil",
        token,
      });

    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error saat login",
        error: error.message,
      });
    }
  },

  // Ambil profile user
  getProfile: async (req, res) => {
    res.status(200).json({
      message: `Selamat datang, ${req.user.username}!`,
      user: req.user,
    });
  },

  // Delete user
  userDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

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
};

export default userController;
