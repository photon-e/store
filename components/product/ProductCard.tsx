'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product._id));

  return (
    <article className="group surface-card overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-zinc-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={700}
          height={900}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-white">
          <p className="text-base font-black uppercase tracking-[0.14em]">GENERAL</p>
          <p className="text-xs tracking-[0.25em]">★★★★★</p>
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex justify-between gap-2">
          <h3 className="text-sm uppercase tracking-[0.14em]">{product.name}</h3>
          <span className="text-sm">{formatPriceWithDollarEquivalent(product.price)}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{product.category}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              addItem({
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              size: product.sizes[0],
              color: product.colors[0],
              quantity: 1,
            })
          }
          className="w-full rounded-md border border-zinc-900 px-3 py-2 text-xs uppercase tracking-[0.16em] transition hover:bg-zinc-900 hover:text-white"
          >
            Add to cart
          </button>
          <button
            onClick={() => toggle(product._id)}
            className={`w-full rounded-md border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${wished ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 hover:border-zinc-900'}`}
          >
            {wished ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </article>
  );
}
