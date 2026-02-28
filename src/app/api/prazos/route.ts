import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const processoId = searchParams.get('processoId') || ''
    const periodo = searchParams.get('periodo') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (processoId) where.processoId = processoId

    if (periodo === 'hoje') {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const amanha = new Date(hoje)
      amanha.setDate(amanha.getDate() + 1)
      where.dataLimite = { gte: hoje, lt: amanha }
    } else if (periodo === 'semana') {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const fimSemana = new Date(hoje)
      fimSemana.setDate(fimSemana.getDate() + 7)
      where.dataLimite = { gte: hoje, lt: fimSemana }
    } else if (periodo === 'vencidos') {
      where.dataLimite = { lt: new Date() }
      where.status = 'pendente'
    }

    const [prazos, total] = await Promise.all([
      prisma.prazo.findMany({
        where,
        include: {
          processo: {
            select: { id: true, numero: true, assunto: true, cliente: { select: { id: true, nome: true } } },
          },
        },
        orderBy: { dataLimite: 'asc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.prazo.count({ where }),
    ])

    return NextResponse.json({ prazos, total, paginas: Math.ceil(total / limite) })
  } catch (error) {
    console.error('Erro ao listar prazos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const prazo = await prisma.prazo.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        dataLimite: new Date(dados.dataLimite),
        tipo: dados.tipo || 'outro',
        status: dados.status || 'pendente',
        prioridade: dados.prioridade || 'normal',
        processoId: dados.processoId,
      },
      include: {
        processo: { select: { id: true, numero: true, assunto: true } },
      },
    })

    return NextResponse.json(prazo, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar prazo:', error)
    return NextResponse.json({ error: 'Erro ao criar prazo' }, { status: 500 })
  }
}
