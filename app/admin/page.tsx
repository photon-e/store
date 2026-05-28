import { sampleProducts } from '@/lib/sampleData';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const totalSales = 25430;
  const totalOrders = 338;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl uppercase tracking-[0.2em]">Admin Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Total Sales</p>
          <p className="mt-2 text-2xl">{formatPriceWithDollarEquivalent(totalSales)}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Orders</p>
          <p className="mt-2 text-2xl">{totalOrders}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Products</p>
          <p className="mt-2 text-2xl">{sampleProducts.length}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase text-zinc-500">Users</p>
          <p className="mt-2 text-2xl">1,245</p>
        </div>
      </div>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleProducts.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-3">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPriceWithDollarEquivalent(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className="space-x-2">
                    <Button size="sm">Edit</Button>
                    <Button size="sm" className="border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
