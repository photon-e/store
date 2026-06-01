import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';
import { getAdminAuth } from '@/lib/adminAuth';
import type { Category } from '@/types';

const allowedCategories: Category[] = ['men', 'women', 'kids'];

type ProductPayload = {
  name: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
};

function parseStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseProductPayload(body: Record<string, unknown>) {
  const errors: string[] = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name) errors.push('Product name is required.');
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push('Slug must use lowercase letters, numbers, and hyphens.');
  if (!description) errors.push('Description is required.');
  if (!allowedCategories.includes(category as Category)) errors.push('Category must be men, women, or kids.');
  if (!Number.isFinite(price) || price <= 0) errors.push('Price must be a positive number.');
  if (!Number.isInteger(stock) || stock < 0) errors.push('Stock must be a whole number greater than or equal to 0.');

  const payload: ProductPayload = {
    name,
    slug,
    description,
    category: category as Category,
    price,
    stock,
    sizes: parseStringList(body.sizes),
    colors: parseStringList(body.colors),
    images: parseStringList(body.images),
  };

  return { errors, payload };
}

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ fallback: true, products: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!getAdminAuth(request)) {
    return NextResponse.json({ message: 'Admin access is required to create products.' }, { status: 403 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { errors, payload } = parseProductPayload(body);
  if (errors.length > 0) {
    return NextResponse.json({ message: errors[0], errors }, { status: 400 });
  }

  try {
    await connectDB();
    const product = await ProductModel.create(payload);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'A product with this slug already exists.' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Unable to create product.' }, { status: 500 });
  }
}
