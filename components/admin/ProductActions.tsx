'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setError('');
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || 'Unable to delete product.');
        return;
      }
      router.refresh();
    } catch {
      setError('Could not reach the store. Check your connection and try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link href={`/admin/products/${productId}`} className="inline-flex rounded-md border border-zinc-300 px-3 py-2 text-[11px] uppercase tracking-[0.12em] hover:border-zinc-900">Edit</Link>
        <Button size="sm" disabled={deleting} onClick={remove} className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50 hover:text-red-800">
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
      {error ? <p role="alert" className="mt-2 max-w-48 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
