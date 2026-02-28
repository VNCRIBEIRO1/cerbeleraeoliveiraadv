import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca') || ''
    const status = searchParams.get('status') || ''
    const clienteId = searchParams.get('clienteId') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const where: Record<string, unknown> = {}

    if (busca) {
      where.OR = [
        { numero: { contains: busca } },
        { assunto: { contains: busca } },
        { tipo: { contains: busca } },
      ]
    }
    if (status) where.status = status
    if (clienteId) where.clienteId = clienteId

    const [processos, total] = await Promise.all([
      prisma.processo.findMany({
        where,
        include: {
          cliente: { select: { id: true, nome: true } },
          advogado: { select: { id: true, nome: true } },
          _count: { select: { prazos: true, andamentos: true, documentos: true, pagamentos: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.processo.count({ where }),
    ])

    return NextResponse.json({ processos, total, paginas: Math.ceil(total / limite), paginaAtual: pagina })
  } catch (error) {
    console.error('Erro ao listar processos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const processo = await prisma.processo.create({
      data: {
        numero: dados.numero || null,
        tipo: dados.tipo,
        assunto: dados.assunto,
        descricao: dados.descricao || null,
        status: dados.status || 'em_andamento',
        vara: dados.vara || null,
        comarca: dados.comarca || null,
        valorCausa: dados.valorCausa ? parseFloat(dados.valorCausa) : null,
        dataDistribuicao: dados.dataDistribuicao ? new Date(dados.dataDistribuicao) : null,
        observacoes: dados.observacoes || null,
        clienteId: dados.clienteId,
        advogadoId: dados.advogadoId || null,
      },
      include: {
        cliente: { select: { id: true, nome: true } },
        advogado: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(processo, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar processo:', error)
    return NextResponse.json({ error: 'Erro ao criar processo' }, { status: 500 })
  }
}
