import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. API routes using DB will fail until configured.');
}

const cached = globalThis.mongoose ?? (globalThis.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Configure it in your deployment environment variables.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
