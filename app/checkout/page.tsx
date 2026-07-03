'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';
import { StripePaymentForm } from './StripePaymentForm';

export default function CheckoutPage() {
  const { items, subtotal, tax, total } = useCartStore();

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Sandbox payments</p>
          <h1 className="mt-2 text-2xl uppercase tracking-[0.2em]">Checkout</h1>
        </div>
        <Link href="/cart" className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline">
          Return to cart
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-zinc-600">Your cart is empty. Add an item before starting Stripe checkout.</p>
          <div className="mt-5">
            <Link href="/shop">
              <Button>Continue shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <StripePaymentForm />

          <aside className="surface-card h-fit p-5">
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Order summary</h2>
            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-zinc-500">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span>{formatPriceWithDollarEquivalent(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="my-3" />
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPriceWithDollarEquivalent(subtotal())}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax</span>
                <span>{formatPriceWithDollarEquivalent(tax())}</span>
              </p>
              <p className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPriceWithDollarEquivalent(total())}</span>
              </p>
            </div>
            <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-xs leading-5 text-zinc-600">
              Payments are confirmed by Stripe before an order is created. Sandbox mode never charges a real card.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
