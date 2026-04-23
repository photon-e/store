export default function DashboardPage() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl uppercase tracking-[0.2em]">User Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="border p-5">
          <h2 className="text-sm uppercase tracking-[0.16em]">Profile</h2>
          <p className="mt-3 text-sm text-zinc-600">Manage account details, shipping addresses, and preferences.</p>
        </section>
        <section className="border p-5">
          <h2 className="text-sm uppercase tracking-[0.16em]">Recent Orders</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li>#ORD-2026-1021 · Delivered</li>
            <li>#ORD-2026-1018 · Processing</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
