import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearSessionCookie()
    return NextResponse.json({ message: 'Logout realizado' })
  } catch {
    return NextResponse.json({ error: 'Erro no logout' }, { status: 500 })
  }
}
