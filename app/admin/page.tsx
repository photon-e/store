import Link from 'next/link';
import { ProductActions } from '@/components/admin/ProductActions';
import { Button } from '@/components/ui/Button';
import { formatPounds } from '@/lib/currency';
import { connectDB } from '@/lib/db';
import { requireAdminPage } from '@/lib/requireAdmin';
import { ProductModel } from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdminPage();
  await connectDB();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Store administration</p><h1 className="mt-2 text-2xl uppercase tracking-[0.2em]">Products</h1></div><Link href="/admin/products/new"><Button variant="primary">Add product</Button></Link></div>
      <section className="surface-card p-5">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-[0.14em] text-zinc-500"><th className="py-2">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => (<tr key={String(product._id)} className="border-b"><td className="py-3">{product.name}</td><td className="capitalize">{product.category}</td><td>{formatPounds(product.pricePence)}</td><td>{product.stock}</td><td><ProductActions productId={String(product._id)} /></td></tr>))}</tbody></table></div>
        {products.length === 0 ? <p className="py-10 text-center text-sm text-zinc-600">No products yet. Add your first product to begin selling.</p> : null}
      </section>
    </div>
  );
}
