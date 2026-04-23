'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!response.ok) {
      alert('Registration failed');
      return;
    }

    router.push('/login');
  };

  return (
    <div className="container-page py-16">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4 border p-6">
        <h1 className="text-xl uppercase tracking-[0.2em]">Register</h1>
        <input required name="name" placeholder="Name" className="w-full border px-3 py-2 text-sm" />
        <input required type="email" name="email" placeholder="Email" className="w-full border px-3 py-2 text-sm" />
        <input required type="password" minLength={6} name="password" placeholder="Password" className="w-full border px-3 py-2 text-sm" />
        <button className="w-full bg-zinc-900 py-3 text-xs uppercase tracking-[0.18em] text-white">Create account</button>
      </form>
    </div>
  );
}
