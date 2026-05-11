'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';

const PAGE_SIZE = 6;

export function ShopClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const next = products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => size === 'all' || p.sizes.includes(size))
      .filter((p) => p.price <= maxPrice);

    if (sort === 'price-low') next.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') next.sort((a, b) => b.price - a.price);
    if (sort === 'newest') next.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    return next;
  }, [products, query, category, size, maxPrice, sort]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="space-y-8">
      <div className="grid gap-3 md:grid-cols-5">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-zinc-300 px-3 py-2 text-sm">
          <option value="all">All categories</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="border border-zinc-300 px-3 py-2 text-sm">
          <option value="all">All sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-zinc-300 px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price-low">Price low-high</option>
          <option value="price-high">Price high-low</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Max price: {formatPriceWithDollarEquivalent(maxPrice)}</label>
        <input type="range" min={10000} max={100000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="border px-3 py-2 text-xs uppercase disabled:opacity-40">Prev</button>
        <span className="text-xs uppercase tracking-[0.15em]">{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="border px-3 py-2 text-xs uppercase disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
