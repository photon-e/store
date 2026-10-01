'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  pricePence: number;
  description: string;
  category: 'men' | 'women' | 'kids';
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
};

type ProductFormProps = {
  product?: AdminProduct;
};

function listToText(values: string[]) {
  return values.join(', ');
}

function textToList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const pricePounds = Number(formData.get('pricePounds'));
    const payload = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      category: formData.get('category'),
      pricePence: Math.round(pricePounds * 100),
      stock: Number(formData.get('stock')),
      sizes: textToList(String(formData.get('sizes') || '')),
      colors: textToList(String(formData.get('colors') || '')),
      images: textToList(String(formData.get('images') || '')),
    };

    if (!Number.isFinite(pricePounds) || pricePounds < 0) {
      setError('Enter a valid non-negative GBP price.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || 'Unable to save product. Check the details and try again.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Could not reach the store. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface-card mx-auto max-w-3xl space-y-5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Product catalogue</p>
        <h1 className="mt-2 text-2xl uppercase tracking-[0.16em]">{product ? 'Edit product' : 'Add product'}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Name</span><Input required name="name" defaultValue={product?.name} /></label>
        <label className="space-y-2 text-sm"><span>Slug</span><Input required name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={product?.slug} /></label>
        <label className="space-y-2 text-sm"><span>Price (GBP)</span><Input required name="pricePounds" type="number" min="0" step="0.01" defaultValue={product ? (product.pricePence / 100).toFixed(2) : ''} /></label>
        <label className="space-y-2 text-sm"><span>Stock</span><Input required name="stock" type="number" min="0" step="1" defaultValue={product?.stock} /></label>
        <label className="space-y-2 text-sm"><span>Category</span><Select name="category" defaultValue={product?.category || 'men'}><option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option></Select></label>
      </div>

      <label className="block space-y-2 text-sm"><span>Description</span><textarea required name="description" defaultValue={product?.description} className="min-h-32 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm" /></label>
      <label className="block space-y-2 text-sm"><span>Sizes (comma separated)</span><Input required name="sizes" defaultValue={product ? listToText(product.sizes) : ''} placeholder="S, M, L, XL" /></label>
      <label className="block space-y-2 text-sm"><span>Colours (comma separated)</span><Input required name="colors" defaultValue={product ? listToText(product.colors) : ''} placeholder="Black, White" /></label>
      <label className="block space-y-2 text-sm"><span>Image paths or HTTPS URLs (comma separated)</span><Input required name="images" defaultValue={product ? listToText(product.images) : ''} placeholder="/images/product.jpg" /></label>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex gap-3"><Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</Button><Button type="button" onClick={() => router.push('/admin')}>Cancel</Button></div>
    </form>
  );
}
