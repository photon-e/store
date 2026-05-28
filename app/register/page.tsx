'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <form onSubmit={submit} className="surface-card mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-xl uppercase tracking-[0.2em]">Register</h1>
        <Input required name="name" placeholder="Name" autoComplete="name" />
        <Input required type="email" name="email" placeholder="Email" autoComplete="email" />
        <Input required type="password" minLength={6} name="password" placeholder="Password" autoComplete="new-password" />
        <Button className="w-full" variant="primary" type="submit">
          Create account
        </Button>
        <p className="text-sm text-zinc-600">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
