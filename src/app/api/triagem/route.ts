import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [triagens, total] = await Promise.all([
      prisma.triagem.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.triagem.count({ where }),
    ])

    return NextResponse.json({ triagens, total, paginas: Math.ceil(total / limite) })
  } catch (error) {
    console.error('Erro ao listar triagens:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST é público - recebe dados do chatbot
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const triagem = await prisma.triagem.create({
      data: {
        nome: dados.nome,
        telefone: dados.telefone,
        area: dados.area,
        subarea: dados.subarea || '',
        urgencia: dados.urgencia || 'normal',
        detalhes: typeof dados.detalhes === 'string' ? dados.detalhes : JSON.stringify(dados.detalhes),
        status: 'nova',
      },
    })

    return NextResponse.json(triagem, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar triagem:', error)
    return NextResponse.json({ error: 'Erro ao criar triagem' }, { status: 500 })
  }
}
