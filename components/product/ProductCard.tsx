'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product._id));

  const primaryImage = product.images[0] || '/images/product-1.jpg';
  const defaultSize = product.sizes[0] || 'One Size';
  const defaultColor = product.colors[0] || 'Default';

  return (
    <article className="group surface-card overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-zinc-100">
        <Image
          src={primaryImage}
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
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            onClick={() =>
              addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: primaryImage,
                size: defaultSize,
                color: defaultColor,
                quantity: 1,
              })
            }
          >
            Add to cart
          </Button>
          <Button
            className="w-full"
            variant={wished ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggle(product._id)}
          >
            {wished ? 'Wishlisted' : 'Wishlist'}
          </Button>
        </div>
      </div>
    </article>
  );
}
