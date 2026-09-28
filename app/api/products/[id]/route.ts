import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';
import { isAuthorizationError, requireAdmin } from '@/lib/requireAdmin';
import { parseProductInput, ProductValidationError } from '@/lib/productValidation';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const product = await ProductModel.findById(id);
  if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    const product = await ProductModel.findByIdAndUpdate(id, parseProductInput(await request.json()), { new: true });
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    if (isAuthorizationError(error)) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof ProductValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Unable to update product.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isAuthorizationError(error)) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: 'Unable to delete product.' }, { status: 500 });
  }
}
