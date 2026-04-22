import { connectDB } from '@/lib/db';
import { ProductModel } from '@/models/Product';
import { sampleProducts } from '@/lib/sampleData';

async function seed() {
  await connectDB();
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
