import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
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

  // Proteger APIs do painel (exceto login)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/triagem')) {
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
  matcher: ['/painel/:path*', '/api/clientes/:path*', '/api/processos/:path*', '/api/agenda/:path*', '/api/financeiro/:path*', '/api/prazos/:path*', '/api/documentos/:path*', '/api/exportar/:path*', '/api/backup/:path*', '/api/dashboard/:path*']
}
