'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn('w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm', className)}
      {...props}
    />
  );
}

