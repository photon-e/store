import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ fallback: true, products: [] });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const product = await ProductModel.create(body);
  return NextResponse.json(product, { status: 201 });
}
