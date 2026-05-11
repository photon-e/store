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

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setSize('all');
    setMaxPrice(100000);
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <div className="surface-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Refine products</p>
          <button onClick={clearFilters} className="text-xs uppercase tracking-[0.15em] text-zinc-600 hover:text-zinc-900">Reset filters</button>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search products..." className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option value="all">All categories</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
        <select value={size} onChange={(e) => { setSize(e.target.value); setPage(1); }} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option value="all">All sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price-low">Price low-high</option>
          <option value="price-high">Price high-low</option>
        </select>
        </div>

        <div className="mt-4">
          <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Max price: {formatPriceWithDollarEquivalent(maxPrice)}</label>
        <input type="range" min={10000} max={100000} value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }} className="w-full accent-zinc-900" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-zinc-500">
        <p>{filtered.length} items found</p>
        <p>Page {page} of {totalPages}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {paginated.length === 0 && (
        <div className="surface-card p-10 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.14em]">No products match your filters</p>
          <button onClick={clearFilters} className="text-xs uppercase tracking-[0.15em] text-zinc-600 underline underline-offset-4 hover:text-zinc-900">Reset and browse all products</button>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="border px-3 py-2 text-xs uppercase disabled:opacity-40">Prev</button>
        <span className="text-xs uppercase tracking-[0.15em]">{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="border px-3 py-2 text-xs uppercase disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
