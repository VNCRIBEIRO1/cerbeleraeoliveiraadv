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

    const updateData: Record<string, unknown> = {}
    if (dados.titulo !== undefined) updateData.titulo = dados.titulo
    if (dados.descricao !== undefined) updateData.descricao = dados.descricao || null
    if (dados.dataHora) updateData.dataHora = new Date(dados.dataHora)
    if (dados.duracao !== undefined) updateData.duracao = parseInt(String(dados.duracao)) || 60
    if (dados.tipo !== undefined) updateData.tipo = dados.tipo
    if (dados.status !== undefined) updateData.status = dados.status
    if (dados.local !== undefined) updateData.local = dados.local || null
    if (dados.observacoes !== undefined) updateData.observacoes = dados.observacoes || null
    if (dados.clienteId !== undefined) updateData.clienteId = dados.clienteId || null

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: updateData,
    })

    // Sincronizar com Google Calendar
    if (agendamento.googleEventId) {
      try {
        const session = await getSession()
        if (session) {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { googleSyncAtivo: true, googleRefreshToken: true },
          })
          if (user?.googleSyncAtivo && user.googleRefreshToken) {
            // Se o status mudou para cancelado → DELETAR do Google Calendar
            if (dados.status === 'cancelado') {
              await deletarEventoGoogle(session.userId, agendamento.googleEventId)
              // Limpar o googleEventId local após deletar do Google
              await prisma.agendamento.update({
                where: { id },
                data: { googleEventId: null },
              })
            } else {
              // Atualizar evento no Google com os novos dados
              await atualizarEventoGoogle(session.userId, agendamento.googleEventId, {
                titulo: updateData.titulo as string | undefined,
                descricao: updateData.descricao as string | undefined,
                dataHora: updateData.dataHora as Date | undefined,
                duracao: updateData.duracao as number | undefined,
                local: updateData.local as string | undefined,
              })
            }
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
