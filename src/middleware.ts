import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'timepick_session'
const ONE_YEAR = 60 * 60 * 24 * 365

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.cookies.get(SESSION_COOKIE)) {
    return response
  }

  const sessionToken = crypto.randomUUID().replace(/-/g, '')

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}