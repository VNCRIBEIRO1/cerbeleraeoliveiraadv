import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/horarios-disponiveis — ENDPOINT PÚBLICO
// Retorna apenas horários ocupados (sem dados sensíveis) + bloqueios ativos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')
    const ano = searchParams.get('ano')

    if (!mes || !ano) {
      return NextResponse.json({ error: 'Parâmetros mes e ano são obrigatórios' }, { status: 400 })
    }

    const mesNum = parseInt(mes)
    const anoNum = parseInt(ano)
    const inicio = new Date(anoNum, mesNum - 1, 1)
    const fim = new Date(anoNum, mesNum, 0, 23, 59, 59)

    // 1. Buscar agendamentos ocupados (APENAS horários, sem dados pessoais)
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: { gte: inicio, lte: fim },
        status: { notIn: ['cancelado'] },
      },
      select: {
        dataHora: true,
        duracao: true,
      },
    })

    // Montar mapa de horários ocupados por dia
    const ocupados: Record<string, string[]> = {}
    agendamentos.forEach(ag => {
      const dt = new Date(ag.dataHora)
      const key = dt.toISOString().split('T')[0]
      const hora = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
      if (!ocupados[key]) ocupados[key] = []
      ocupados[key].push(hora)

      // Se duração > 30min, bloquear slots seguintes
      if (ag.duracao > 30) {
        const slotsExtra = Math.ceil((ag.duracao - 30) / 30)
        for (let i = 1; i <= slotsExtra; i++) {
          const extra = new Date(dt)
          extra.setMinutes(extra.getMinutes() + (i * 30))
          const horaExtra = `${String(extra.getHours()).padStart(2, '0')}:${String(extra.getMinutes()).padStart(2, '0')}`
          if (!ocupados[key]) ocupados[key] = []
          ocupados[key].push(horaExtra)
        }
      }
    })

    // 2. Buscar bloqueios ativos no período
    const bloqueios = await prisma.bloqueioHorario.findMany({
      where: {
        ativo: true,
        OR: [
          // Bloqueios pontuais dentro do período
          {
            recorrente: false,
            dataInicio: { lte: fim },
            OR: [
              { dataFim: { gte: inicio } },
              { dataFim: null },
            ],
          },
          // Bloqueios recorrentes (sempre aplicam)
          { recorrente: true },
        ],
      },
      select: {
        tipo: true,
        dataInicio: true,
        dataFim: true,
        horaInicio: true,
        horaFim: true,
        motivo: true,
        recorrente: true,
        diaSemana: true,
      },
    })

    // 3. Processar bloqueios para dias completos bloqueados e parciais
    const diasBloqueados: string[] = []
    const bloqueiosParciais: { data: string; horaInicio: string; horaFim: string; motivo: string }[] = []

    bloqueios.forEach(b => {
      if (b.recorrente && b.diaSemana !== null) {
        // Bloqueio recorrente: marcar todos os dias do mês com esse dia da semana
        for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
          if (d.getDay() === b.diaSemana) {
            const key = d.toISOString().split('T')[0]
            if (b.tipo === 'dia_inteiro') {
              diasBloqueados.push(key)
            } else if (b.horaInicio && b.horaFim) {
              bloqueiosParciais.push({ data: key, horaInicio: b.horaInicio, horaFim: b.horaFim, motivo: b.motivo || '' })
            }
          }
        }
      } else {
        // Bloqueio pontual
        const dInicio = new Date(b.dataInicio)
        const dFim = b.dataFim ? new Date(b.dataFim) : dInicio

        for (let d = new Date(dInicio); d <= dFim; d.setDate(d.getDate() + 1)) {
          if (d >= inicio && d <= fim) {
            const key = d.toISOString().split('T')[0]
            if (b.tipo === 'dia_inteiro') {
              diasBloqueados.push(key)
            } else if (b.horaInicio && b.horaFim) {
              bloqueiosParciais.push({ data: key, horaInicio: b.horaInicio, horaFim: b.horaFim, motivo: b.motivo || '' })
            }
          }
        }
      }
    })

    return NextResponse.json({
      ocupados,
      diasBloqueados: [...new Set(diasBloqueados)],
      bloqueiosParciais,
    })
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
