import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sampleProducts } from '@/lib/sampleData';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = sampleProducts.find((p) => p.slug === id || p._id === id);

  if (!product) return notFound();

  const related = sampleProducts.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 3);

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <Image src={product.images[0]} alt={product.name} width={900} height={1000} className="h-[32rem] w-full object-cover" />
        <div>
          <ProductDetailClient product={product} />

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">Reviews</h3>
            <div className="space-y-3 text-sm text-zinc-600">
              <p>★★★★★ 4.8 · “Excellent quality and fit.”</p>
              <p>★★★★☆ 4.0 · “Great fabric, size up for relaxed look.”</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">Related Products</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item._id} href={`/product/${item.slug}`} className="text-xs uppercase tracking-[0.12em] hover:text-zinc-500">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
