import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import { sampleProducts } from '@/lib/sampleData';
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

function sortByNewest(products: Product[]) {
  return [...products].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function getFallbackProducts(limit?: number) {
  const products = sortByNewest(sampleProducts);
  return typeof limit === 'number' ? products.slice(0, limit) : products;
}

function logProductFallback(error: unknown) {
  console.error('Unable to load products from MongoDB. Rendering sample catalog instead.', error);
}

export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    await connectDB();

    let query = ProductModel.find().sort({ createdAt: -1 }).lean<ProductDocument[]>();
    if (limit) query = query.limit(limit);

    const products = await query;
    return products.map(toProduct);
  } catch (error) {
    logProductFallback(error);
    return getFallbackProducts(limit);
  }
}

export async function getProductBySlugOrId(id: string): Promise<Product | null> {
  try {
    await connectDB();

    const product = await ProductModel.findOne({
      $or: [{ slug: id }, ...(isValidObjectId(id) ? [{ _id: id }] : [])],
    }).lean<ProductDocument>();

    return product ? toProduct(product) : null;
  } catch (error) {
    logProductFallback(error);
    return sampleProducts.find((product) => product.slug === id || product._id === id) ?? null;
  }
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  try {
    await connectDB();

    const related = await ProductModel.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<ProductDocument[]>();

    return related.map(toProduct);
  } catch (error) {
    logProductFallback(error);
    return getFallbackProducts()
      .filter((item) => item.category === product.category && item._id !== product._id)
      .slice(0, limit);
  }
}
