// ============================================================
// API: /api/google/auth — Iniciar OAuth do Google Calendar
// ============================================================
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAuthUrl } from '@/lib/google-calendar'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const url = getAuthUrl(session.userId)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Erro ao gerar URL de auth Google:', error)
    const msg = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
