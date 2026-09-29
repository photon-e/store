'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ApiError = { message?: string };

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).get('registered') === '1');
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json().catch(() => ({}))) as ApiError;
      if (!response.ok) {
        setError(result.message || 'We couldn’t sign you in. Check your details and try again.');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('We couldn’t reach the store. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
        <aside className="flex min-h-56 flex-col justify-between bg-zinc-950 p-8 text-white sm:p-10">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.3em]">GENERAL</Link>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Welcome back</p>
            <h1 className="mt-3 max-w-xs text-3xl font-medium leading-tight sm:text-4xl">Good things look good on you.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300">Sign in to pick up where you left off and keep your account close.</p>
          </div>
          <Link href="/shop" className="mt-8 text-xs uppercase tracking-[0.16em] text-zinc-300 underline underline-offset-4 hover:text-white">Explore the collection</Link>
        </aside>

        <form onSubmit={submit} className="space-y-6 p-6 sm:p-10" aria-labelledby="login-heading">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Your account</p>
            <h2 id="login-heading" className="mt-2 text-2xl font-medium">Sign in</h2>
            <p className="mt-2 text-sm text-zinc-600">Enter the email and password you used to register.</p>
          </div>

          {registered ? <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Your account is ready. Sign in with the email and password you just registered.</div> : null}
          {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-medium" htmlFor="login-email">
              <span>Email address</span>
              <Input id="login-email" required type="email" name="email" placeholder="you@example.com" autoComplete="email" className="h-11 rounded-lg" />
            </label>
            <label className="block space-y-2 text-sm font-medium" htmlFor="login-password">
              <span>Password</span>
              <Input id="login-password" required type="password" name="password" placeholder="Your password" autoComplete="current-password" className="h-11 rounded-lg" />
            </label>
          </div>

          <Button className="w-full rounded-lg py-3.5" variant="primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="text-center text-sm text-zinc-600">
            New to GENERAL? <Link href="/register" className="font-medium text-zinc-950 underline underline-offset-4">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
