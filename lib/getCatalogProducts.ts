import { connectDB, isMongoDBConfigured } from '@/lib/db';
import { sampleProducts } from '@/lib/sampleData';
import { ProductModel } from '@/models/Product';
import type { Product } from '@/types';

export async function getCatalogProducts(): Promise<Product[]> {
  if (!isMongoDBConfigured()) return sampleProducts;

  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean().exec();
    return products.map((product) => ({
      ...product,
      _id: String(product._id),
      createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : String(product.createdAt ?? ''),
    })) as Product[];
  } catch {
    return sampleProducts;
  }
}
