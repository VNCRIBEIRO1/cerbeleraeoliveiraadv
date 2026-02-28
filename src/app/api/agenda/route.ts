import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        duracao: dados.duracao || 60,
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

    return NextResponse.json(agendamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }
}
