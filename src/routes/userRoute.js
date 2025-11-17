// src/routes/userRoute.js
import express from 'express';
import userController from '../controllers/userController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRoute = express.Router();

// Register user baru (hanya admin)
userRoute.post('/register', authMiddleware, isAdmin, userController.register);


// Login user
userRoute.post('/login', userController.login);

// Profile user (butuh token)
userRoute.get('/profile', authMiddleware, userController.getProfile);

// Ambil semua user
userRoute.get('/', authMiddleware, isAdmin, userController.getAllUsers);

// Hapus user (hanya admin)
userRoute.delete('/:id', authMiddleware, isAdmin, userController.userDelete);

export default userRoute;