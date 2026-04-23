import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/checkout'];

type MiddlewarePayload = {
  role?: 'customer' | 'admin';
};

function parseTokenPayload(token: string): MiddlewarePayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as MiddlewarePayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) return NextResponse.next();

  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  const payload = parseTokenPayload(token);
  if (!payload) return NextResponse.redirect(new URL('/login', request.url));

  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/checkout/:path*'],
};
