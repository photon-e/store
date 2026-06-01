import Link from 'next/link';
import { ShopClient } from '@/components/shop/ShopClient';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Live catalog</p>
          <h1 className="text-2xl uppercase tracking-[0.2em]">Shop</h1>
        </div>
        {products.length === 0 && (
          <Link href="/admin" className="text-xs uppercase tracking-[0.15em] text-zinc-500 underline underline-offset-4 hover:text-zinc-900">
            Add products in admin
          </Link>
        )}
      </div>
      <ShopClient products={products} />
    </div>
  );
}
