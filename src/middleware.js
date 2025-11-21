import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get('token')?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Always let request continue when no redirect happens
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
