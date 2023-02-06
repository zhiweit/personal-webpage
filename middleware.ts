// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyJwtCookie } from './lib/auth'
// import JwtHelper from './lib/jwtHelper'
import { USER_TOKEN } from './lib/constants'

// Limit the middleware to paths starting with `/api/`,
// all pages except api/completeRegistration, api/cookies, login, api/login, api/register
// index, register, 
export const config = {
  matcher: [
    '/admin/:function*',
    '/((?!api/completeRegistration|api/cookies|api/registration|api/login|lib|public|styles|types).*)',
  ],
}

export async function middleware(request: NextRequest) {
  // for login page, if cookie is present, redirect to home page
  const pathname = request.nextUrl.pathname
  // console.log('pathname', pathname)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api') ) {
    // console.log(`at ${pathname} page`)
    try {
      const jwtPayload = await verifyJwtCookie(request)
      if (!jwtPayload || jwtPayload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error: any) {
      console.error('Internal server error in validating jwt cookie in middleware', error.message)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } else if (request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
}