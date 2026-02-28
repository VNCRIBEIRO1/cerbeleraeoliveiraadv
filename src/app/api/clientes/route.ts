import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca') || ''
    const status = searchParams.get('status') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const where: Record<string, unknown> = {}

    if (busca) {
      where.OR = [
        { nome: { contains: busca } },
        { cpfCnpj: { contains: busca } },
        { email: { contains: busca } },
        { telefone: { contains: busca } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        include: {
          advogado: { select: { id: true, nome: true } },
          _count: { select: { processos: true, agendamentos: true, pagamentos: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.cliente.count({ where }),
    ])

    return NextResponse.json({
      clientes,
      total,
      paginas: Math.ceil(total / limite),
      paginaAtual: pagina,
    })
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const cliente = await prisma.cliente.create({
      data: {
        nome: dados.nome,
        cpfCnpj: dados.cpfCnpj || null,
        email: dados.email || null,
        telefone: dados.telefone,
        whatsapp: dados.whatsapp || dados.telefone,
        endereco: dados.endereco || null,
        cidade: dados.cidade || null,
        estado: dados.estado || null,
        cep: dados.cep || null,
        observacoes: dados.observacoes || null,
        origem: dados.origem || 'manual',
        status: dados.status || 'ativo',
        advogadoId: dados.advogadoId || null,
      },
      include: {
        advogado: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
