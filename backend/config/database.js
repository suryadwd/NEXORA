import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibecommerce';
    if (!uri) {
      throw new Error('MONGODB_URI is not set. Create backend/.env with your Atlas URI.');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Do not hard exit in dev – surface the error and let the server respond gracefully
    throw error;
  }
};

export default connectDB;

