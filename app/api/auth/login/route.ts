import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();

  const user = await UserModel.findOne({ email: body.email });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const isValid = await bcrypt.compare(body.password, user.passwordHash);
  if (!isValid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const token = signToken({ userId: String(user._id), role: user.role });
  const response = NextResponse.json({ message: 'Logged in', role: user.role });
  response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return response;
}
