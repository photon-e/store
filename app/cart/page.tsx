'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, subtotal, tax, total, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-2xl uppercase tracking-[0.2em]">Cart</h1>
      {items.length === 0 ? (
        <div className="border p-8 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block border px-4 py-2 text-xs uppercase">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border p-4">
                <Image src={item.image} alt={item.name} width={120} height={160} className="h-28 w-24 object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm uppercase tracking-[0.12em]">{item.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{item.color} / {item.size}</p>
                  <p className="mt-2 text-sm">${item.price}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="border px-2">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="border px-2">+</button>
                    <button onClick={() => removeItem(item.productId, item.size, item.color)} className="ml-4 text-xs uppercase text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit border p-5">
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Summary</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Subtotal</span><span>${subtotal().toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>${tax().toFixed(2)}</span></p>
              <p className="flex justify-between font-semibold"><span>Total</span><span>${total().toFixed(2)}</span></p>
            </div>
            <Link href="/checkout" className="mt-5 block w-full bg-zinc-900 px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-white">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
