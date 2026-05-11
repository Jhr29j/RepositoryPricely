import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/listas', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  if (!isProtected) return NextResponse.next()

  // El token se guarda en localStorage (client-side), así que
  // la verificación real la hace cada página con useAuthStore.
  // Este middleware solo redirige si hay una cookie de sesión (opcional).
  const token = request.cookies.get('pricely_token')?.value
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/listas/:path*', '/admin/:path*'],
}