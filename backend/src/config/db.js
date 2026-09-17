import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export const connectDB = async (uri = env.MONGODB_URI) => {
  if (isConnected || mongoose.connection.readyState === 1 || env.NODE_ENV === 'test') {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    if (env.NODE_ENV !== 'test') {
      console.log(`✅ MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    }

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      if (env.NODE_ENV !== 'test') {
        console.warn('⚠️ MongoDB disconnected.');
      }
    });

    return conn;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    if (env.NODE_ENV !== 'test') {
      console.log('MongoDB connection closed.');
    }
  }
};

export default connectDB;
