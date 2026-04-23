import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/checkout'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) return NextResponse.next();

  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  // Keep middleware edge-safe for simple deployments.
  // Role checks happen in server routes/pages when configured.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/checkout/:path*'],
};
