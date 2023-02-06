import { AuthError, deleteJwtCookie, setJwtCookie, verifyJwtCookie } from "@/lib/auth"
import { NO_TOKEN_FOUND, USER_TOKEN } from "@/lib/constants"
import { jsonResponse } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
      // console.log('req.json', req.)
      const payload = await req.json()
      // console.log('payload', payload)
      res = jsonResponse(201, { message: 'Login success' })
      return await setJwtCookie(res, payload)

    } catch (error) {
      console.error(error)
      return jsonResponse(500, { message: "Server unable to set jwt in cookie" })
    }

  } else if (req.method === 'GET') { // returns jwt cookie payload if present (200). If token not present, return 404. If token is present but invalid, return 401
    try {
      const jwtPayload = await verifyJwtCookie(req)
      // console.log('jwtPayload in GET api/cookies:', jwtPayload)
      return jsonResponse(200, { data: jwtPayload })

    } catch (error: unknown) {
      // console.log('error in GET api/cookies:', error)
      // if (error instanceof AuthError) {
      //   console.log('AuthError', error.message)
      //   return res
      //   // return jsonResponse(401, { message: error.message })

      // } else if (error instanceof Error) {
      //   if (error.message === NO_TOKEN_FOUND) {
      //     console.log('NO_TOKEN_FOUND')
      //     return jsonResponse(404, { message: NO_TOKEN_FOUND })
      //   }
        
      // }
      return jsonResponse(500, { message: "Server unable to get USER_TOKEN" })
      
    }

  } else if (req.method === 'DELETE') { // delete cookie
    try {
      // console.log(req.cookies)
      // console.log('req.cookies.get(USER_TOKEN)', req.cookies.get(USER_TOKEN))
      req.cookies.delete(USER_TOKEN)
      // console.log('req.cookies.get(USER_TOKEN)', req.cookies.get(USER_TOKEN))
      //  req.cookies.set(USER_TOKEN, '')
      
      // console.log('req.cookies.get(USER_TOKEN)', req.cookies.get(USER_TOKEN))
      return 
      // return jsonResponse(200, { message: 'Logout success' })
    } catch (error) {
      console.error(error)
      return jsonResponse(500, { message: `Server unable to delete ${USER_TOKEN} cookie` })
    }
  }
}