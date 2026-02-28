import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || ''
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rotas do painel (exceto login)
  if (pathname.startsWith('/painel') && !pathname.startsWith('/painel/login')) {
    const token = request.cookies.get('painel_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/painel/login', request.url))
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/painel/login', request.url))
    }
  }

  // Proteger APIs do painel (exceto auth, health e callback Google)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/health')) {
    // POST para /api/triagem é público (recebe dados do chatbot)
    if (pathname === '/api/triagem' && request.method === 'POST') {
      return NextResponse.next()
    }

    // Callback do Google OAuth é público (recebe redirecionamento do Google)
    if (pathname === '/api/google/callback') {
      return NextResponse.next()
    }

    const token = request.cookies.get('painel_token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/painel/:path*', '/api/clientes/:path*', '/api/processos/:path*', '/api/agenda/:path*', '/api/financeiro/:path*', '/api/prazos/:path*', '/api/triagem/:path*', '/api/dashboard/:path*', '/api/exportar/:path*', '/api/google/:path*']
}
