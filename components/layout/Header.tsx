'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          <Link href="/shop" className="transition hover:text-zinc-900">
            Shop
          </Link>
          <Link href="/dashboard" className="transition hover:text-zinc-900">
            Dashboard
          </Link>
        </nav>
        <Link href="/" className="flex flex-col items-center text-sm font-semibold uppercase tracking-[0.35em]">
          <span>GENERAL</span>
          <span className="mt-1 text-[10px] tracking-[0.2em] text-amber-500">★★★★★</span>
        </Link>
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          <Link href="/login" className="transition hover:text-zinc-900">
            Account
          </Link>
          <Link href="/cart" className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-900 transition hover:border-zinc-900">
            Cart ({count})
          </Link>
        </div>
      </div>
    </header>
  );
}
