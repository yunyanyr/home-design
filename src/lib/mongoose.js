import mongoose from 'mongoose';

// 使用本地MongoDB服务
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            // bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 30000
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            })
            .catch((e) => {
                console.error('MongoDB connection error:', e);
                throw e;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect; 