// config/cloudinaryConfig.js
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
console.log("=== CLOUDINARY CONFIG DEBUG ===");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Cloudinary instance:", cloudinary);
console.log("Cloudinary.v2:", cloudinary.v2);
console.log("=== END DEBUG ===");

export default cloudinary;