import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { UserModel } from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json({ message: 'Service unavailable. Please try again later.' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const existing = await UserModel.findOne({ email: body.email });
    if (existing) return NextResponse.json({ message: 'Email already in use' }, { status: 400 });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await UserModel.create({ name: body.name, email: body.email, passwordHash, role: 'customer' });

    return NextResponse.json({ id: user._id, email: user.email });
  } catch {
    return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
