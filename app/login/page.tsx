'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <form onSubmit={submit} className="surface-card mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-xl uppercase tracking-[0.2em]">Login</h1>
        <Input required type="email" name="email" placeholder="Email" autoComplete="email" />
        <Input required type="password" name="password" placeholder="Password" autoComplete="current-password" />
        <Button className="w-full" variant="primary" type="submit">
          Sign in
        </Button>
        <p className="text-sm text-zinc-600">
          No account?{' '}
          <Link href="/register" className="underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
