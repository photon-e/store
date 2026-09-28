'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(true);
    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (!response.ok) {
      setDeleting(false);
      window.alert('Unable to delete product.');
      return;
    }
    router.refresh();
  };

  return <div className="flex gap-2"><Link href={`/admin/products/${productId}`}><Button size="sm">Edit</Button></Link><Button size="sm" disabled={deleting} onClick={remove} className="border-red-400 text-red-600 hover:border-red-500 hover:bg-red-50 hover:text-red-700">{deleting ? 'Deleting…' : 'Delete'}</Button></div>;
}
