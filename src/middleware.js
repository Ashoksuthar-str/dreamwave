import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';

  const token = request.cookies.get('mylogintoken')?.value || "";

  console.log("Middleware token:", token);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
