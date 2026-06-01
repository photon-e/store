import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';
import { Product } from '@/types';

type ProductDocument = {
  _id: unknown;
  name?: string;
  slug?: string;
  price?: number;
  description?: string;
  category?: Product['category'];
  sizes?: string[];
  colors?: string[];
  images?: string[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt?: Date | string;
};

function toProduct(product: ProductDocument): Product {
  const id = String(product._id);

  return {
    _id: id,
    name: product.name ?? '',
    slug: product.slug ?? id,
    price: product.price ?? 0,
    description: product.description ?? '',
    category: product.category ?? 'men',
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    images: product.images?.length ? product.images : ['/images/product-1.jpg'],
    stock: product.stock ?? 0,
    rating: product.rating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getProducts(limit?: number): Promise<Product[]> {
  await connectDB();

  let query = ProductModel.find().sort({ createdAt: -1 }).lean<ProductDocument[]>();
  if (limit) query = query.limit(limit);

  const products = await query;
  return products.map(toProduct);
}

export async function getProductBySlugOrId(id: string): Promise<Product | null> {
  await connectDB();

  const product = await ProductModel.findOne({
    $or: [{ slug: id }, ...(isValidObjectId(id) ? [{ _id: id }] : [])],
  }).lean<ProductDocument>();

  return product ? toProduct(product) : null;
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  await connectDB();

  const related = await ProductModel.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ProductDocument[]>();

  return related.map(toProduct);
}
