// ============================================================
// API: /api/google/sync — Sincronizar Google Calendar
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sincronizarParaGoogle, sincronizarDoGoogle } from '@/lib/google-calendar'
import { prisma } from '@/lib/prisma'

// POST: Executar sincronização
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário tem Google vinculado
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { googleSyncAtivo: true, googleRefreshToken: true },
    })

    if (!user?.googleSyncAtivo || !user.googleRefreshToken) {
      return NextResponse.json({ error: 'Google Calendar não vinculado' }, { status: 400 })
    }

    const dados = await request.json()
    const mes = dados.mes || new Date().getMonth() + 1
    const ano = dados.ano || new Date().getFullYear()
    const direcao = dados.direcao || 'ambos' // 'enviar', 'receber', 'ambos'

    let resultadoEnvio = { criados: 0, total: 0 }
    let resultadoImportacao = { importados: 0 }

    if (direcao === 'enviar' || direcao === 'ambos') {
      resultadoEnvio = await sincronizarParaGoogle(session.userId, mes, ano)
    }

    if (direcao === 'receber' || direcao === 'ambos') {
      resultadoImportacao = await sincronizarDoGoogle(session.userId, mes, ano)
    }

    return NextResponse.json({
      sucesso: true,
      envio: resultadoEnvio,
      importacao: resultadoImportacao,
      mes, ano,
    })
  } catch (error) {
    console.error('Erro na sincronização Google:', error)
    return NextResponse.json({ error: 'Erro na sincronização' }, { status: 500 })
  }
}

// GET: Status da integração
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        googleSyncAtivo: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
        googleCalendarId: true,
      },
    })

    return NextResponse.json({
      conectado: !!(user?.googleRefreshToken && user.googleSyncAtivo),
      calendarId: user?.googleCalendarId || 'primary',
      tokenExpiry: user?.googleTokenExpiry,
    })
  } catch (error) {
    console.error('Erro ao verificar status Google:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
