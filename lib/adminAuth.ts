import { NextRequest } from 'next/server';
import { AuthPayload, verifyToken } from '@/lib/auth';

export function getAdminAuth(request: NextRequest): AuthPayload | null {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}
