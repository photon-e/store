import type mongoose from 'mongoose';

declare global {
  var __mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

export {};
