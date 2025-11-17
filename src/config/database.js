// mongoose import
import mongoose from "mongoose";

// import .env untuk membaca .env
import 'dotenv/config';

// function untuk menghubungkan database
const connectDB = async() => {
    // try untuk menangkap database pada .env
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected and running");
    } catch (error) {
        // tidakan jika rerjadi error
        console.error(error.message);
        // keluar jika terjadi error
        process.exit();
    }
};

export default connectDB;
