import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/bloqueios/[id] — Atualizar bloqueio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    const bloqueio = await prisma.bloqueioHorario.update({
      where: { id },
      data: {
        tipo: dados.tipo,
        dataInicio: dados.dataInicio ? new Date(dados.dataInicio) : undefined,
        dataFim: dados.dataFim ? new Date(dados.dataFim) : undefined,
        horaInicio: dados.horaInicio,
        horaFim: dados.horaFim,
        motivo: dados.motivo,
        recorrente: dados.recorrente,
        diaSemana: dados.diaSemana !== undefined ? parseInt(String(dados.diaSemana)) : undefined,
        ativo: dados.ativo,
      },
    })

    return NextResponse.json(bloqueio)
  } catch (error) {
    console.error('Erro ao atualizar bloqueio:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

// DELETE /api/bloqueios/[id] — Remover bloqueio
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.bloqueioHorario.delete({ where: { id } })
    return NextResponse.json({ message: 'Bloqueio removido' })
  } catch (error) {
    console.error('Erro ao remover bloqueio:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
