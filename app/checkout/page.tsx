'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

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
        <form onSubmit={submit} className="space-y-4 border p-5">
          <h2 className="text-sm uppercase tracking-[0.16em]">Shipping</h2>
          <input required name="fullName" placeholder="Full Name" className="w-full border px-3 py-2 text-sm" />
          <input required type="email" name="email" placeholder="Email" className="w-full border px-3 py-2 text-sm" />
          <input required name="address" placeholder="Address" className="w-full border px-3 py-2 text-sm" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required name="city" placeholder="City" className="w-full border px-3 py-2 text-sm" />
            <input required name="postalCode" placeholder="Postal code" className="w-full border px-3 py-2 text-sm" />
          </div>
          <input required name="country" placeholder="Country" className="w-full border px-3 py-2 text-sm" />
          <button disabled={loading || items.length === 0} className="w-full bg-zinc-900 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-40">
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </button>
        </form>

        <aside className="h-fit border p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">Order summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <p key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between"><span>{item.name} × {item.quantity}</span><span>₦{(item.price * item.quantity).toFixed(2)}</span></p>
            ))}
            <hr className="my-3" />
            <p className="flex justify-between"><span>Subtotal</span><span>₦{subtotal().toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Tax</span><span>₦{tax().toFixed(2)}</span></p>
            <p className="flex justify-between font-semibold"><span>Total</span><span>₦{total().toFixed(2)}</span></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
