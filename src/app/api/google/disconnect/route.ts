// ============================================================
// API: /api/google/disconnect — Desconectar Google Calendar
// ============================================================
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
        googleSyncAtivo: false,
      },
    })

    return NextResponse.json({ sucesso: true, message: 'Google Calendar desconectado' })
  } catch (error) {
    console.error('Erro ao desconectar Google:', error)
    return NextResponse.json({ error: 'Erro ao desconectar' }, { status: 500 })
  }
}
