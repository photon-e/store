'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function StripePaymentForm() {
  const { items, subtotal, tax, total } = useCartStore();
  const [checkoutError, setCheckoutError] = useState('');
  const [loading, setLoading] = useState(false);
  const amount = total();
  const [wasCanceled, setWasCanceled] = useState(false);

  useEffect(() => {
    setWasCanceled(new URLSearchParams(window.location.search).get('canceled') === '1');
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const shippingAddress = Object.fromEntries(formData.entries());

    const sessionRes = await fetch('/api/checkout/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '000000000000000000000001',
        items,
        shippingAddress,
        subtotal: subtotal(),
        tax: tax(),
        total: amount,
      }),
    });

    const session = await sessionRes.json();

    if (!sessionRes.ok || !session.url) {
      setCheckoutError(session.error || 'Stripe Checkout could not be started.');
      setLoading(false);
      return;
    }

    window.location.assign(session.url);
  };

  return (
    <form onSubmit={submit} className="surface-card space-y-5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Secure sandbox checkout</p>
        <h2 className="mt-2 text-lg font-semibold">Shipping & Stripe payment</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Enter shipping details here, then complete payment on Stripe&apos;s hosted sandbox checkout page.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-[0.16em]">Shipping</h3>
        <Input required name="fullName" placeholder="Full Name" autoComplete="name" />
        <Input required type="email" name="email" placeholder="Email" autoComplete="email" />
        <Input required name="address" placeholder="Address" autoComplete="street-address" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input required name="city" placeholder="City" autoComplete="address-level2" />
          <Input required name="postalCode" placeholder="Postal code" autoComplete="postal-code" />
        </div>
        <Input required name="country" placeholder="Country" autoComplete="country-name" />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm uppercase tracking-[0.16em]">Payment</h3>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
            Stripe test mode
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          You&apos;ll be redirected to Stripe Checkout. Use test card 4242 4242 4242 4242 with any future expiry,
          any CVC, and any postal code.
        </p>
      </div>

      {wasCanceled ? (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Stripe Checkout was canceled. Your cart is still here when you&apos;re ready to try again.
        </p>
      ) : null}
      {checkoutError ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{checkoutError}</p> : null}

      <Button disabled={loading || items.length === 0} className="w-full" variant="primary" type="submit">
        {loading ? 'Redirecting to Stripe...' : `Pay ${formatPriceWithDollarEquivalent(amount)} with Stripe`}
      </Button>
    </form>
  );
}
