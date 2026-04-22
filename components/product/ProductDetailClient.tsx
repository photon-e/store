'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(product.sizes[0] || 'M');
  const [color, setColor] = useState(product.colors[0] || 'Black');

  return (
    <>
      <h1 className="text-3xl uppercase tracking-[0.14em]">{product.name}</h1>
      <p className="mt-3 text-2xl">${product.price}</p>
      <p className="mt-5 text-zinc-600">{product.description}</p>

      <div className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em]">Size</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`border px-3 py-1 text-xs uppercase ${size === s ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em]">Color</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`border px-3 py-1 text-xs uppercase ${color === c ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => addItem({ productId: product._id, name: product.name, image: product.images[0], price: product.price, size, color, quantity: 1 })}
        className="mt-8 w-full bg-zinc-900 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Add to cart
      </button>
    </>
  );
}
