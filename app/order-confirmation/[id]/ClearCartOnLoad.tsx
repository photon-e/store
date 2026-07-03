'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function ClearCartOnLoad() {
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
