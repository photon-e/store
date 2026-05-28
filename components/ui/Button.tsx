'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center rounded-md text-xs uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800',
  outline: 'border border-zinc-900 px-4 py-3 text-zinc-900 hover:bg-zinc-900 hover:text-white',
  ghost: 'px-3 py-2 text-zinc-600 hover:text-zinc-900',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-2',
  md: '',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, variant = 'outline', size = 'md', ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

