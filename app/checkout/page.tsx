'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total, clear } = useCartStore();
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shippingAddress = Object.fromEntries(formData.entries());

    setLoading(true);

    const intentRes = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total() }),
    });

    if (!intentRes.ok) {
      setLoading(false);
      alert('Payment initialization failed. Check Stripe keys.');
      return;
    }

    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '000000000000000000000001',
        items,
        shippingAddress,
        subtotal: subtotal(),
        tax: tax(),
        total: total(),
        status: 'paid',
      }),
    });

    const order = await orderRes.json();
    clear();
    router.push(`/order-confirmation/${order._id || 'demo'}`);
  };

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-2xl uppercase tracking-[0.2em]">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-4 p-5">
          <h2 className="text-sm uppercase tracking-[0.16em]">Shipping</h2>
          <Input required name="fullName" placeholder="Full Name" autoComplete="name" />
          <Input required type="email" name="email" placeholder="Email" autoComplete="email" />
          <Input required name="address" placeholder="Address" autoComplete="street-address" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required name="city" placeholder="City" autoComplete="address-level2" />
            <Input required name="postalCode" placeholder="Postal code" autoComplete="postal-code" />
          </div>
          <Input required name="country" placeholder="Country" autoComplete="country-name" />
          <Button disabled={loading || items.length === 0} className="w-full" variant="primary" type="submit">
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </Button>
        </form>

        <aside className="surface-card h-fit p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Order summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <p key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPriceWithDollarEquivalent(item.price * item.quantity)}</span>
              </p>
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
            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPriceWithDollarEquivalent(total())}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
