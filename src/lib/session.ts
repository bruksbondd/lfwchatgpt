import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}

export function withNextSession(apiRoute: NextApiHandler) {
  return withIronSessionApiRoute(apiRoute, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'user-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
}

export type User = {
  isLoggedIn?: boolean
  login?: string
  avatarUrl?: string
  uid: string | string[] | number | any
} | null
