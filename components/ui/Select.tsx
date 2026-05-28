'use client';

import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn('w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm', className)} {...props} />;
}

