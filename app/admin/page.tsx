import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { requireAdminPage } from '@/lib/requireAdmin';
import { formatPounds } from '@/lib/currency';
import { ProductModel } from '@/models/Product';
import { ProductActions } from '@/components/admin/ProductActions';

export default async function AdminPage() {
  await requireAdminPage();
  await connectDB();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean().exec();

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">GENERAL / Store management</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-zinc-600">Manage product details, prices, and available stock.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex w-fit items-center justify-center rounded-lg bg-zinc-950 px-5 py-3 text-xs uppercase tracking-[0.16em] text-white hover:bg-zinc-800">
          <span aria-hidden="true" className="mr-2 text-base">+</span> Add product
        </Link>
      </div>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-medium">Product catalogue</h2>
          <span className="text-xs text-zinc-500">{products.length} {products.length === 1 ? 'product' : 'products'}</span>
        </div>
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-medium">Your catalogue is empty</h3>
            <p className="mt-2 text-sm text-zinc-600">Add your first product to start building the shop.</p>
            <Link href="/admin/products/new" className="mt-5 inline-flex rounded-lg border border-zinc-300 px-4 py-2.5 text-xs uppercase tracking-[0.14em] hover:border-zinc-900">Add a product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={String(product._id)} className="align-middle">
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">/{product.slug}</p>
                    </td>
                    <td className="px-4 py-4 capitalize text-zinc-600">{product.category}</td>
                    <td className="px-4 py-4 tabular-nums">{formatPounds(product.pricePence)}</td>
                    <td className="px-4 py-4 tabular-nums">
                      <span className={product.stock === 0 ? 'text-red-700' : 'text-zinc-700'}>{product.stock}</span>
                      {product.stock === 0 ? <span className="ml-2 text-xs text-red-600">Out of stock</span> : null}
                    </td>
                    <td className="px-5 py-4 sm:px-6"><ProductActions productId={String(product._id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
