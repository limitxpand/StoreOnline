import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect the admin paths
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow access to the login and auth API
  if (path === '/admin/login' || path.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  // Check for the admin token cookie
  const token = request.cookies.get('admin_token');

  if (!token) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

// Configure the paths where this middleware runs
export const config = {
  matcher: ['/admin/:path*'],
};
