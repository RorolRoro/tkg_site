import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isStaffPage = req.nextUrl.pathname.startsWith('/staff')
    const isUnauthorizedPage = req.nextUrl.pathname === '/unauthorized'
    const isTestPage = req.nextUrl.pathname === '/test-session'
    const isDebugPage = req.nextUrl.pathname === '/debug'
    const isUserTicketsPage = req.nextUrl.pathname === '/mes-tickets'

    console.log('Middleware - Path:', req.nextUrl.pathname)
    console.log('Middleware - Token:', token)
    console.log('Middleware - Token role:', token?.role)

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!token && !isAuthPage && !isTestPage && !isDebugPage && !isUserTicketsPage) {
      console.log('Middleware - Redirection vers signin (pas de token)')
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Si l'utilisateur est connecté mais n'a pas le bon rôle, bloquer l'accès
    if (token && token.role && token.role !== 'JOUEUR' && token.role !== 'STAFF' && token.role !== 'ADMIN') {
      console.log('Middleware - Redirection vers unauthorized (mauvais rôle):', token.role)
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Vérifier l'accès aux pages staff (seuls les STAFF et ADMIN peuvent y accéder)
    if (isStaffPage && token?.role !== 'STAFF' && token?.role !== 'ADMIN') {
      console.log('Middleware - Redirection vers unauthorized (accès staff)')
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    console.log('Middleware - Accès autorisé')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isUnauthorizedPage = req.nextUrl.pathname === '/unauthorized'
        const isTestPage = req.nextUrl.pathname === '/test-session'
        const isDebugPage = req.nextUrl.pathname === '/debug'
        const isUserTicketsPage = req.nextUrl.pathname === '/mes-tickets'

        // Pages d'authentification, d'erreur et de test accessibles sans token
        if (isAuthPage || isUnauthorizedPage || isTestPage || isDebugPage || isUserTicketsPage) {
          return true
        }

        // Toutes les autres pages nécessitent une authentification
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
