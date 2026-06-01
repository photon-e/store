import Link from 'next/link';
import { AdminProductForm } from '@/components/admin/AdminProductForm';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await getProducts();
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Protected admin</p>
          <h1 className="text-2xl uppercase tracking-[0.2em]">Admin Dashboard</h1>
        </div>
        <Link href="/shop" className="text-xs uppercase tracking-[0.15em] text-zinc-500 underline underline-offset-4 hover:text-zinc-900">
          View live shop
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Products</p>
          <p className="mt-2 text-2xl">{products.length}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Inventory Units</p>
          <p className="mt-2 text-2xl">{products.reduce((sum, product) => sum + product.stock, 0)}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Inventory Value</p>
          <p className="mt-2 text-2xl">{formatPriceWithDollarEquivalent(inventoryValue)}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Low Stock</p>
          <p className="mt-2 text-2xl">{lowStockCount}</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)]">
        <section className="surface-card p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Product Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <th className="py-2">Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="py-3">
                      <Link href={`/product/${product.slug}`} className="hover:text-zinc-500">
                        {product.name}
                      </Link>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPriceWithDollarEquivalent(product.price)}</td>
                    <td>{product.stock}</td>
                    <td className={product.stock <= 5 ? 'text-red-600' : 'text-emerald-700'}>
                      {product.stock <= 5 ? 'Low stock' : 'In stock'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-600">No products yet. Use the form to publish your first catalog item.</p>
          )}
        </section>

        <AdminProductForm />
      </div>
    </div>
  );
}
