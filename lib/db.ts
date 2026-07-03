import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_URI_SCHEME_PATTERN = /^mongodb(?:\+srv)?:\/\//;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

export class MongoDBConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MongoDBConfigurationError';
  }
}

function validateMongoDBUri() {
  if (!MONGODB_URI) {
    throw new MongoDBConfigurationError(
      'MONGODB_URI is not configured. Add a MongoDB connection string that starts with mongodb:// or mongodb+srv://.',
    );
  }

  if (!MONGODB_URI_SCHEME_PATTERN.test(MONGODB_URI)) {
    throw new MongoDBConfigurationError(
      'MONGODB_URI must start with mongodb:// or mongodb+srv://. Check that it is not set to your Stripe key or another URL.',
    );
  }
}

export function isMongoDBConfigured() {
  return MONGODB_URI_SCHEME_PATTERN.test(MONGODB_URI);
}

const cached = globalThis.mongoose ?? (globalThis.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  validateMongoDBUri();
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
