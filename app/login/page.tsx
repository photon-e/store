'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!response.ok) {
      alert('Invalid credentials');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="container-page py-16">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4 border p-6">
        <h1 className="text-xl uppercase tracking-[0.2em]">Login</h1>
        <input required type="email" name="email" placeholder="Email" className="w-full border px-3 py-2 text-sm" />
        <input required type="password" name="password" placeholder="Password" className="w-full border px-3 py-2 text-sm" />
        <button className="w-full bg-zinc-900 py-3 text-xs uppercase tracking-[0.18em] text-white">Sign in</button>
        <p className="text-sm text-zinc-600">No account? <Link href="/register" className="underline">Create one</Link></p>
      </form>
    </div>
  );
}
