import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bloqueios — Listar bloqueios (autenticado)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ativos = searchParams.get('ativos')

    const where: Record<string, unknown> = {}
    if (ativos === 'true') where.ativo = true

    const bloqueios = await prisma.bloqueioHorario.findMany({
      where,
      orderBy: { dataInicio: 'asc' },
    })

    return NextResponse.json(bloqueios)
  } catch (error) {
    console.error('Erro ao listar bloqueios:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/bloqueios — Criar bloqueio
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    if (!dados.tipo || !dados.dataInicio) {
      return NextResponse.json({ error: 'Tipo e data de início são obrigatórios' }, { status: 400 })
    }

    const bloqueio = await prisma.bloqueioHorario.create({
      data: {
        tipo: dados.tipo,
        dataInicio: new Date(dados.dataInicio),
        dataFim: dados.dataFim ? new Date(dados.dataFim) : null,
        horaInicio: dados.horaInicio || null,
        horaFim: dados.horaFim || null,
        motivo: dados.motivo || null,
        recorrente: dados.recorrente || false,
        diaSemana: dados.diaSemana !== undefined ? parseInt(String(dados.diaSemana)) : null,
        ativo: true,
      },
    })

    return NextResponse.json(bloqueio, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar bloqueio:', error)
    return NextResponse.json({ error: 'Erro ao criar bloqueio' }, { status: 500 })
  }
}
