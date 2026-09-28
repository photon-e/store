import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthPayload, verifyToken } from '@/lib/auth';

export class AuthorizationError extends Error {
  constructor() {
    super('You must be an administrator to perform this action.');
    this.name = 'AuthorizationError';
  }
}

export async function requireAdmin(): Promise<AuthPayload> {
  const token = (await cookies()).get('token')?.value;
  if (!token) throw new AuthorizationError();

  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') throw new AuthorizationError();
    return payload;
  } catch (error) {
    if (error instanceof AuthorizationError) throw error;
    throw new AuthorizationError();
  }
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

export async function requireAdminPage() {
  try {
    return await requireAdmin();
  } catch {
    redirect('/login');
  }
}
