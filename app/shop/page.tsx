import { ShopClient } from '@/components/shop/ShopClient';
import { getCatalogProducts } from '@/lib/getCatalogProducts';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getCatalogProducts();
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl uppercase tracking-[0.2em]">Shop</h1>
      <ShopClient products={products} />
    </div>
  );
}
