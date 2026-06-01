import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { getProductBySlugOrId, getRelatedProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);

  if (!product) return notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <Image src={product.images[0]} alt={product.name} width={900} height={1000} className="h-[32rem] w-full object-cover" />
          <div className="absolute bottom-5 left-5 bg-black/70 px-4 py-3 text-white">
            <p className="text-2xl font-black uppercase tracking-[0.14em]">GENERAL</p>
            <p className="text-sm tracking-[0.3em]">★★★★★</p>
          </div>
        </div>
        <div>
          <ProductDetailClient product={product} />

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">Reviews</h3>
            {product.reviewsCount > 0 ? (
              <div className="space-y-3 text-sm text-zinc-600">
                <p>
                  {product.rating.toFixed(1)} / 5 from {product.reviewsCount} customer reviews.
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">No reviews yet. Be the first to review this product.</p>
            )}
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">Related Products</h3>
            {related.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((item) => (
                  <Link key={item._id} href={`/product/${item.slug}`} className="text-xs uppercase tracking-[0.12em] hover:text-zinc-500">
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">No related products are available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
