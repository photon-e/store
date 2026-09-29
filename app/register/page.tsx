'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ApiError = { message?: string };

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json().catch(() => ({}))) as ApiError;
      if (!response.ok) {
        setError(result.message || 'We couldn’t create your account. Please try again.');
        return;
      }
      router.push('/login?registered=1');
    } catch {
      setError('We couldn’t reach the store. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
        <aside className="flex min-h-56 flex-col justify-between bg-amber-100 p-8 text-zinc-950 sm:p-10">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.3em]">GENERAL</Link>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">A better everyday</p>
            <h1 className="mt-3 max-w-xs text-3xl font-medium leading-tight sm:text-4xl">Find your next favourite.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-700">Create an account for a simpler way to shop our considered collection.</p>
          </div>
          <Link href="/shop" className="mt-8 text-xs uppercase tracking-[0.16em] underline underline-offset-4 hover:text-zinc-600">Browse the shop</Link>
        </aside>

        <form onSubmit={submit} className="space-y-6 p-6 sm:p-10" aria-labelledby="register-heading">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Join GENERAL</p>
            <h2 id="register-heading" className="mt-2 text-2xl font-medium">Create your account</h2>
            <p className="mt-2 text-sm text-zinc-600">A few details and you’re all set.</p>
          </div>

          {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-medium" htmlFor="register-name">
              <span>Full name</span>
              <Input id="register-name" required name="name" placeholder="Your name" autoComplete="name" className="h-11 rounded-lg" />
            </label>
            <label className="block space-y-2 text-sm font-medium" htmlFor="register-email">
              <span>Email address</span>
              <Input id="register-email" required type="email" name="email" placeholder="you@example.com" autoComplete="email" className="h-11 rounded-lg" />
            </label>
            <label className="block space-y-2 text-sm font-medium" htmlFor="register-password">
              <span>Password</span>
              <Input id="register-password" required type="password" minLength={6} name="password" placeholder="At least 6 characters" autoComplete="new-password" className="h-11 rounded-lg" />
            </label>
          </div>

          <Button className="w-full rounded-lg py-3.5" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-zinc-600">
            Already have an account? <Link href="/login" className="font-medium text-zinc-950 underline underline-offset-4">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
