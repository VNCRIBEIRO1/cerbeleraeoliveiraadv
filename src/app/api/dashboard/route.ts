import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const [
      totalClientes,
      totalProcessos,
      processosAtivos,
      prazosHoje,
      prazosSemana,
      prazosVencidos,
      agendamentosHoje,
      triagensNovas,
      parcelasAtrasadas,
      totalRecebido,
      totalPendente,
      clientesPorMes,
    ] = await Promise.all([
      prisma.cliente.count({ where: { status: 'ativo' } }),
      prisma.processo.count(),
      prisma.processo.count({ where: { status: 'em_andamento' } }),
      prisma.prazo.count({
        where: {
          status: 'pendente',
          dataLimite: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.prazo.count({
        where: {
          status: 'pendente',
          dataLimite: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.prazo.count({
        where: {
          status: 'pendente',
          dataLimite: { lt: new Date() },
        },
      }),
      prisma.agendamento.count({
        where: {
          dataHora: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: { in: ['agendado', 'confirmado', 'pendente'] },
        },
      }),
      prisma.triagem.count({ where: { status: 'nova' } }),
      prisma.parcela.count({
        where: {
          status: 'pendente',
          dataVencimento: { lt: new Date() },
        },
      }),
      prisma.parcela.aggregate({
        where: { status: 'pago' },
        _sum: { valor: true },
      }),
      prisma.parcela.aggregate({
        where: { status: 'pendente' },
        _sum: { valor: true },
      }),
      prisma.cliente.count({
        where: {
          criadoEm: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

    // Contadores extras para badges
    const agendamentosPendentes = await prisma.agendamento.count({
      where: { status: 'pendente' },
    })

    // Próximos prazos
    const proximosPrazos = await prisma.prazo.findMany({
      where: { status: 'pendente' },
      include: {
        processo: {
          select: { numero: true, assunto: true, cliente: { select: { nome: true } } },
        },
      },
      orderBy: { dataLimite: 'asc' },
      take: 5,
    })

    // Próximos agendamentos (incluindo pendentes)
    const proximosAgendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: { gte: new Date() },
        status: { in: ['agendado', 'confirmado', 'pendente'] },
      },
      include: {
        cliente: { select: { nome: true, telefone: true } },
      },
      orderBy: { dataHora: 'asc' },
      take: 5,
    })

    // Últimas triagens
    const ultimasTriagens = await prisma.triagem.findMany({
      where: { status: 'nova' },
      orderBy: { criadoEm: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      stats: {
        totalClientes,
        totalProcessos,
        processosAtivos,
        prazosHoje,
        prazosSemana,
        prazosVencidos,
        agendamentosHoje,
        triagensNovas,
        parcelasAtrasadas,
        totalRecebido: totalRecebido._sum.valor || 0,
        totalPendente: totalPendente._sum.valor || 0,
        clientesPorMes,
        agendamentosPendentes,
      },
      proximosPrazos,
      proximosAgendamentos,
      ultimasTriagens,
    })
  } catch (error) {
    console.error('Erro no dashboard:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
