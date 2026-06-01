'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatPriceWithDollarEquivalent } from '@/lib/currency';
import type { Category } from '@/types';

const categories: Category[] = ['women', 'men', 'kids'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AdminProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const previewPrice = useMemo(() => {
    const numericPrice = Number(price);
    return Number.isFinite(numericPrice) && numericPrice > 0 ? formatPriceWithDollarEquivalent(numericPrice) : null;
  }, [price]);

  const updateName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData(form);
    const payload = {
      name,
      slug,
      price: Number(price),
      description: String(formData.get('description') || ''),
      category: String(formData.get('category') || 'women'),
      sizes: String(formData.get('sizes') || ''),
      colors: String(formData.get('colors') || ''),
      images: String(formData.get('images') || ''),
      stock: Number(formData.get('stock')),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || 'Unable to create product. Please check the fields and try again.');
        return;
      }

      setMessage(`${result.name} was added to the live catalog.`);
      setName('');
      setSlug('');
      setSlugTouched(false);
      setPrice('');
      form.reset();
      router.refresh();
    } catch {
      setError('Unable to reach the product API. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface-card space-y-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Catalog admin</p>
        <h2 className="mt-2 text-lg uppercase tracking-[0.16em]">Add Product</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Name</span>
          <Input required value={name} onChange={(event) => updateName(event.target.value)} placeholder="Oversized Denim Jacket" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Slug</span>
          <Input
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            placeholder="oversized-denim-jacket"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm">
        <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Description</span>
        <textarea
          required
          name="description"
          rows={4}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          placeholder="Describe the fabric, fit, and styling details."
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Category</span>
          <Select required name="category" defaultValue="women">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Price in naira</span>
          <Input required min={1} step={1} type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="145000" />
          {previewPrice && <span className="block text-xs text-zinc-500">Displays as {previewPrice}</span>}
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Stock</span>
          <Input required min={0} step={1} type="number" name="stock" placeholder="25" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Sizes</span>
          <Input name="sizes" placeholder="S, M, L, XL" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Colors</span>
          <Input name="colors" placeholder="Blue, Black" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Images</span>
          <Input name="images" placeholder="/images/product-5.jpg" />
        </label>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}

      <Button disabled={loading} type="submit" variant="primary">
        {loading ? 'Adding product...' : 'Add product'}
      </Button>
    </form>
  );
}
