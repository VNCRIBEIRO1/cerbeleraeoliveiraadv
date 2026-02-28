import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    const prazo = await prisma.prazo.update({
      where: { id },
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        dataLimite: dados.dataLimite ? new Date(dados.dataLimite) : undefined,
        tipo: dados.tipo,
        status: dados.status,
        prioridade: dados.prioridade,
      },
    })

    return NextResponse.json(prazo)
  } catch (error) {
    console.error('Erro ao atualizar prazo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.prazo.delete({ where: { id } })
    return NextResponse.json({ message: 'Prazo removido' })
  } catch (error) {
    console.error('Erro ao deletar prazo:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
