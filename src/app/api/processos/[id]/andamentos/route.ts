import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    const andamento = await prisma.andamento.create({
      data: {
        descricao: dados.descricao,
        tipo: dados.tipo || 'outro',
        data: dados.data ? new Date(dados.data) : new Date(),
        processoId: id,
      },
    })

    return NextResponse.json(andamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar andamento:', error)
    return NextResponse.json({ error: 'Erro ao criar andamento' }, { status: 500 })
  }
}
