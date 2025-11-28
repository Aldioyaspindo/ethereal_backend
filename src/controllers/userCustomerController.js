import UserCustomer from "../models/userCustomerModel.js";
import jwt from "jsonwebtoken";

const UserCustomerController = {

  // REGISTER CUSTOMER
  registerCustomer: async (req, res) => {
    const { username, password, nomorhp } = req.body;

    if (!username || !password || !nomorhp) {
      return res.status(400).json({ 
        message: "Username, password, dan nomor HP wajib diisi" 
      });
    }

    try {
      const existing = await UserCustomer.findOne({
        username: username.trim().toLowerCase()
      });

      if (existing) {
        return res.status(400).json({ 
          message: "Username sudah digunakan" 
        });
      }

      const newCustomer = new UserCustomer({
        username: username.trim().toLowerCase(),
        password: password.trim(),
        nomorhp: nomorhp.trim(),
      });

      await newCustomer.save();

      res.status(201).json({
        success: true,
        message: "Customer berhasil didaftarkan",
        data: {
          _id: newCustomer._id,
          username: newCustomer.username,
          nomorhp: newCustomer.nomorhp,
          role: newCustomer.role
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error saat registrasi customer",
        error: error.message,
      });
    }
  },


loginCustomer: async (req, res) => {
  const { username, password } = req.body;

  console.log("📥 Login attempt:", { username });

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password wajib diisi",
    });
  }

  try {
    // 1. Cari user
    const customer = await UserCustomer.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!customer) {
      console.log("❌ User not found:", username);
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // 2. Validasi password
    const isMatch = await customer.comparePassword(password.trim());
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // 3. Buat JWT token
    const payload = {
      id: customer._id,
      username: customer.username,
      role: customer.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("🔑 Token generated:", token.substring(0, 30) + "...");

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    console.log("✅ Cookie set successfully");
    console.log("📋 Cookie config:", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // 5. Response
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        role: customer.role,
      },
    });

    console.log("✅ Login successful for user:", username);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat login",
    });
  }
},
};

export default UserCustomerController;
