import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,

        // Production optimizations
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((error) => {
        // Reset promise if connection fails
        cached.promise = null;

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
