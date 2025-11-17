// File: src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware untuk verifikasi JWT
export const authMiddleware = async (req, res, next) => {
  
  try {
    // Ambil token dari header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah user masih ada di database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Simpan user di request agar bisa digunakan di controller berikutnya
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
