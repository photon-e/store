'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/shop" className="text-xs uppercase tracking-[0.2em]">
          Shop
        </Link>
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.35em]">
          MONO
        </Link>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em]">
          <Link href="/login">Account</Link>
          <Link href="/cart">Cart ({count})</Link>
        </div>
      </div>
    </header>
  );
}
