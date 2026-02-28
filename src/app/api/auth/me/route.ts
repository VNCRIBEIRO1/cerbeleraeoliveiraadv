import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    return NextResponse.json({ user: session })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
