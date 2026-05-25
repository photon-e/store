import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();

  const order = await OrderModel.create(body);
  if (body?.shippingAddress?.email) {
    await sendOrderConfirmationEmail(body.shippingAddress.email, String(order._id));
  }

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  await connectDB();
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
