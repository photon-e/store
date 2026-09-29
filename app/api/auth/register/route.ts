import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, MongoDBConfigurationError } from '@/lib/db';
import { UserModel } from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Fill in your name, email address, and password.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Choose a password with at least 6 characters.' }, { status: 400 });
    }

    await connectDB();
    const existing = await UserModel.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (existing) return NextResponse.json({ message: 'An account with this email already exists. Sign in instead, or use a different email.' }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash, role: 'customer' });

    return NextResponse.json({ id: user._id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error('Registration request failed:', error);
    const message = error instanceof MongoDBConfigurationError
      ? 'Account creation is not configured yet. The site owner needs to add a valid MONGODB_URI in Netlify.'
      : 'We couldn’t connect to the accounts database. Check your connection and try again shortly.';
    return NextResponse.json({ message }, { status: 503 });
  }
}
