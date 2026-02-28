import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { atualizarEventoGoogle, deletarEventoGoogle } from '@/lib/google-calendar'

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

    // Sincronizar atualização com Google Calendar
    if (agendamento.googleEventId) {
      try {
        const session = await getSession()
        if (session) {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { googleSyncAtivo: true, googleRefreshToken: true },
          })
          if (user?.googleSyncAtivo && user.googleRefreshToken) {
            await atualizarEventoGoogle(session.userId, agendamento.googleEventId, {
              titulo: dados.titulo,
              descricao: dados.descricao,
              dataHora: dados.dataHora ? new Date(dados.dataHora) : undefined,
              duracao: dados.duracao,
              local: dados.local,
            })
          }
        }
      } catch (syncError) {
        console.error('Erro ao sincronizar update com Google:', syncError)
      }
    }

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

    // Buscar antes de deletar para pegar googleEventId
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      select: { googleEventId: true },
    })

    // Deletar do Google Calendar se vinculado
    if (agendamento?.googleEventId) {
      try {
        const session = await getSession()
        if (session) {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { googleSyncAtivo: true, googleRefreshToken: true },
          })
          if (user?.googleSyncAtivo && user.googleRefreshToken) {
            await deletarEventoGoogle(session.userId, agendamento.googleEventId)
          }
        }
      } catch (syncError) {
        console.error('Erro ao deletar do Google:', syncError)
      }
    }

    await prisma.agendamento.delete({ where: { id } })
    return NextResponse.json({ message: 'Agendamento removido' })
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
