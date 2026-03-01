import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { criarEventoGoogle } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')
    const ano = searchParams.get('ano')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (mes && ano) {
      const inicio = new Date(parseInt(ano), parseInt(mes) - 1, 1)
      const fim = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59)
      where.dataHora = { gte: inicio, lte: fim }
    }

    if (status) where.status = status

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        cliente: { select: { id: true, nome: true, telefone: true, whatsapp: true } },
      },
      orderBy: { dataHora: 'asc' },
    })

    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const agendamento = await prisma.agendamento.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        dataHora: new Date(dados.dataHora),
        duracao: parseInt(String(dados.duracao)) || 60,
        tipo: dados.tipo || 'consulta',
        status: dados.status || 'agendado',
        local: dados.local || null,
        observacoes: dados.observacoes || null,
        clienteId: dados.clienteId || null,
      },
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
      },
    })

    // Sincronizar com Google Calendar se o usuário tiver vinculado
    try {
      const session = await getSession()
      if (session) {
        const user = await prisma.user.findUnique({
          where: { id: session.userId },
          select: { googleSyncAtivo: true, googleRefreshToken: true },
        })
        if (user?.googleSyncAtivo && user.googleRefreshToken) {
          const googleEventId = await criarEventoGoogle(session.userId, {
            titulo: agendamento.titulo,
            descricao: agendamento.descricao,
            dataHora: agendamento.dataHora,
            duracao: agendamento.duracao,
            local: agendamento.local,
            tipo: agendamento.tipo,
            clienteNome: agendamento.cliente?.nome,
          })
          if (googleEventId) {
            await prisma.agendamento.update({
              where: { id: agendamento.id },
              data: { googleEventId },
            })
          }
        }
      }
    } catch (syncError) {
      console.error('Erro ao sincronizar com Google (não bloqueia):', syncError)
    }

    return NextResponse.json(agendamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }
}
