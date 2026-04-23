import { sampleProducts } from '@/lib/sampleData';

export default function AdminPage() {
  const totalSales = 25430;
  const totalOrders = 338;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl uppercase tracking-[0.2em]">Admin Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border p-4"><p className="text-xs uppercase text-zinc-500">Total Sales</p><p className="mt-2 text-2xl">₦{totalSales}</p></div>
        <div className="border p-4"><p className="text-xs uppercase text-zinc-500">Orders</p><p className="mt-2 text-2xl">{totalOrders}</p></div>
        <div className="border p-4"><p className="text-xs uppercase text-zinc-500">Products</p><p className="mt-2 text-2xl">{sampleProducts.length}</p></div>
        <div className="border p-4"><p className="text-xs uppercase text-zinc-500">Users</p><p className="mt-2 text-2xl">1,245</p></div>
      </div>

      <section className="border p-5">
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
                  <td>₦{p.price}</td>
                  <td>{p.stock}</td>
                  <td className="space-x-2">
                    <button className="border px-2 py-1 text-xs">Edit</button>
                    <button className="border border-red-400 px-2 py-1 text-xs text-red-600">Delete</button>
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
