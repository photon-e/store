import { ShopClient } from '@/components/shop/ShopClient';
import { sampleProducts } from '@/lib/sampleData';

export default function ShopPage() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl uppercase tracking-[0.2em]">Shop</h1>
      <ShopClient products={sampleProducts} />
    </div>
  );
}
