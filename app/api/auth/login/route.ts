import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, MongoDBConfigurationError } from '@/lib/db';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
      return NextResponse.json({ message: 'Enter your email address and password.' }, { status: 400 });
    }

    await connectDB();
    const user = await UserModel.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!user) return NextResponse.json({ message: 'Email or password doesn’t match an account in this store. If your account is in a different database, create an account here.' }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ message: 'Email or password doesn’t match an account in this store. If your account is in a different database, create an account here.' }, { status: 401 });

    const token = signToken({ userId: String(user._id), role: user.role });
    const response = NextResponse.json({ message: 'Logged in', role: user.role });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    console.error('Login request failed:', error);
    const message = error instanceof MongoDBConfigurationError
      ? 'Account sign-in is not configured yet. The site owner needs to add a valid MONGODB_URI in Netlify.'
      : 'We couldn’t reach the accounts database. Please try again shortly or contact the store if this continues.';
    return NextResponse.json({ message }, { status: 503 });
  }
}
