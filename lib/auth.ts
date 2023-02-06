import type { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'
import { USER_TOKEN, getJwtSecretKey, NO_TOKEN_FOUND, JWT_TOKEN_EXPIRED } from './constants'

export interface UserJwtPayload {
  jti: string
  iat: number
  role?: string
}

export class AuthError extends Error { }

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 * Throws Error "JWT_NOT_PRESENT" if the jwt token is not present in cookie
 * Throws AuthError if JWT is expired or signature is invalid
 */
export async function verifyJwtCookie(req: NextRequest) {
  // console.log('req', req)
  const token = req.cookies.get(USER_TOKEN)?.value
  // console.log('in verifyJwtCookie in auth.ts USER_TOKEN cookie:', token)
  if (!token) throw new Error(NO_TOKEN_FOUND)

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    )
    // console.log('payload', verified.payload)
    return verified.payload as UserJwtPayload
  } catch (err: unknown) {
    // console.log('error in verifyJwtCookie in auth.ts:', err)
    throw new AuthError("JWT token is invalid or expired")
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setJwtCookie(res: NextResponse, jwtPayload: { [propName: string]: unknown }) {
  const token = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(getJwtSecretKey()))

  res.cookies.set(USER_TOKEN, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours in seconds
  })

  return res
}

/**
 * Delete the user token cookie
 */
export function deleteJwtCookie(res: NextResponse) {
  // console.log('in deleteJwtCookies, res.cookies', res.cookies)
  res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 }) // expire JWT cookie
  return res
  // console.log('before deleting user-token cookie, res.cookies.get(USER_TOKEN)=', req.cookies.get(USER_TOKEN))
  // const response = req.cookies.delete(USER_TOKEN)
  // console.log('response for res.cookies.delete(USER_TOKEN)', response)
  // console.log('after deleting user-token cookie, res.cookies.get(USER_TOKEN)=', req.cookies.get(USER_TOKEN))
  
}