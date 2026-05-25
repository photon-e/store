import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const product = await ProductModel.findById(id);
  if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const product = await ProductModel.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await ProductModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
