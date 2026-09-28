import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { AdminProduct } from '@/components/admin/ProductForm';
import { connectDB } from '@/lib/db';
import { requireAdminPage } from '@/lib/requireAdmin';
import { ProductModel } from '@/models/Product';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  await connectDB();
  const { id } = await params;
  const product = await ProductModel.findOne({ _id: id }).lean().exec() as unknown as (AdminProduct & { _id: unknown }) | null;
  if (!product) notFound();

  return (
    <div className="container-page py-10">
      <ProductForm product={{ ...product, id: String(product._id) }} />
    </div>
  );
}
