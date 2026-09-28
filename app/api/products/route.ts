import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';
import { isAuthorizationError, requireAdmin } from '@/lib/requireAdmin';
import { parseProductInput, ProductValidationError } from '@/lib/productValidation';

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
  try {
    await requireAdmin();
    await connectDB();
    const product = await ProductModel.create(parseProductInput(await request.json()));
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (isAuthorizationError(error)) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof ProductValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Unable to create product.' }, { status: 500 });
  }
}
