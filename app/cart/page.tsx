'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, subtotal, tax, total, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-2xl uppercase tracking-[0.2em]">Cart</h1>
      {items.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <div className="mt-5">
            <Link href="/shop">
              <Button>Continue shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="surface-card flex gap-4 p-4">
                <Image src={item.image} alt={item.name} width={120} height={160} className="h-28 w-24 rounded-md object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm uppercase tracking-[0.12em]">{item.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-2 text-sm">{formatPriceWithDollarEquivalent(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="surface-card h-fit p-5">
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Summary</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPriceWithDollarEquivalent(subtotal())}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax</span>
                <span>{formatPriceWithDollarEquivalent(tax())}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPriceWithDollarEquivalent(total())}</span>
              </p>
            </div>
            <div className="mt-5">
              <Link href="/checkout">
                <Button className="w-full" variant="primary">
                  Checkout
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
