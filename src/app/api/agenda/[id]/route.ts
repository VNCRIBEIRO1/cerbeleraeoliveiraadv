import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        dataHora: dados.dataHora ? new Date(dados.dataHora) : undefined,
        duracao: dados.duracao,
        tipo: dados.tipo,
        status: dados.status,
        local: dados.local,
        observacoes: dados.observacoes,
        clienteId: dados.clienteId,
      },
    })

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.agendamento.delete({ where: { id } })
    return NextResponse.json({ message: 'Agendamento removido' })
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
