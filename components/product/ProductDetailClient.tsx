'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/Button';

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(product.sizes[0] || 'M');
  const [color, setColor] = useState(product.colors[0] || 'Black');
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product._id));

  return (
    <>
      <h1 className="text-3xl uppercase tracking-[0.14em]">{product.name}</h1>
      <p className="mt-3 text-2xl">{formatPriceWithDollarEquivalent(product.price)}</p>
      <p className="mt-5 text-zinc-600">{product.description}</p>

      <div className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em]">Size</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <Button key={s} onClick={() => setSize(s)} variant={size === s ? 'primary' : 'outline'} size="sm">
                {s}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em]">Color</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <Button key={c} onClick={() => setColor(c)} variant={color === c ? 'primary' : 'outline'} size="sm">
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          onClick={() => addItem({ productId: product._id, name: product.name, image: product.images[0], price: product.price, size, color, quantity: 1 })}
          variant="primary"
          className="w-full"
        >
          Add to cart
        </Button>
        <Button
          onClick={() => toggleWishlist(product._id)}
          variant={wished ? 'primary' : 'outline'}
          className="w-full"
        >
          {wished ? 'Wishlisted' : 'Wishlist'}
        </Button>
      </div>
    </>
  );
}
