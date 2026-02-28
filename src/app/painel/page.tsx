'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatsCard from '@/components/painel/StatsCard'
import StatusBadge from '@/components/painel/StatusBadge'

interface DashboardData {
  stats: {
    totalClientes: number
    totalProcessos: number
    processosAtivos: number
    prazosHoje: number
    prazosSemana: number
    prazosVencidos: number
    agendamentosHoje: number
    triagensNovas: number
    parcelasAtrasadas: number
    totalRecebido: number
    totalPendente: number
    clientesPorMes: number
  }
  proximosPrazos: Array<{
    id: string
    titulo: string
    dataLimite: string
    prioridade: string
    processo: { numero: string; assunto: string; cliente: { nome: string } }
  }>
  proximosAgendamentos: Array<{
    id: string
    titulo: string
    dataHora: string
    tipo: string
    status: string
    cliente: { nome: string; telefone: string } | null
  }>
  ultimasTriagens: Array<{
    id: string
    nome: string
    telefone: string
    area: string
    urgencia: string
    criadoEm: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => {
        if (!r.ok) throw new Error('Falha ao carregar')
        return r.json()
      })
      .then(setData)
      .catch(() => setErro('Erro ao carregar dados do dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const formatarData = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatarDataHora = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

  const diasAte = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now()
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (dias < 0) return `${Math.abs(dias)}d atrás`
    if (dias === 0) return 'Hoje'
    if (dias === 1) return 'Amanhã'
    return `${dias} dias`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b8a6f]">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-2">{erro || 'Erro ao carregar dashboard'}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm bg-[#1a2e1f] text-[#c9a84c] rounded-lg border border-[#2a3f2e] hover:border-[#c9a84c]/30">
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const { stats } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">Visão geral do escritório</p>
        </div>
        <div className="flex gap-2">
          <Link href="/painel/clientes" className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-medium rounded-lg hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all">
            + Novo Cliente
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          titulo="Clientes Ativos"
          valor={stats.totalClientes}
          subtitulo={`+${stats.clientesPorMes} este mês`}
          cor="gold"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatsCard
          titulo="Processos Ativos"
          valor={stats.processosAtivos}
          subtitulo={`${stats.totalProcessos} total`}
          cor="blue"
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
        <StatsCard
          titulo="Agendamentos Hoje"
          valor={stats.agendamentosHoje}
          subtitulo={`${stats.triagensNovas} triagem(ns) nova(s)`}
          cor="green"
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <StatsCard
          titulo="Prazos Vencidos"
          valor={stats.prazosVencidos}
          subtitulo={`${stats.prazosHoje} para hoje | ${stats.prazosSemana} na semana`}
          cor={stats.prazosVencidos > 0 ? 'red' : 'green'}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          titulo="Total Recebido"
          valor={formatarMoeda(stats.totalRecebido)}
          cor="green"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatsCard
          titulo="Total Pendente"
          valor={formatarMoeda(stats.totalPendente)}
          cor="orange"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatsCard
          titulo="Parcelas Atrasadas"
          valor={stats.parcelasAtrasadas}
          cor={stats.parcelasAtrasadas > 0 ? 'red' : 'green'}
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Prazos */}
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl">
          <div className="px-5 py-4 border-b border-[#2a3f2e] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Próximos Prazos</h3>
            <Link href="/painel/prazos" className="text-xs text-[#c9a84c] hover:text-[#d4b55a]">Ver todos</Link>
          </div>
          <div className="divide-y divide-[#2a3f2e]/50">
            {data.proximosPrazos.length === 0 ? (
              <p className="px-5 py-8 text-center text-[#6b8a6f] text-sm">Nenhum prazo pendente</p>
            ) : (
              data.proximosPrazos.map(prazo => (
                <div key={prazo.id} className="px-5 py-3 hover:bg-[#1a2e1f]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{prazo.titulo}</p>
                      <p className="text-xs text-[#6b8a6f] mt-0.5">
                        {prazo.processo.cliente.nome} - {prazo.processo.numero || prazo.processo.assunto}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium ${
                        new Date(prazo.dataLimite) < new Date() ? 'text-red-400' :
                        new Date(prazo.dataLimite).toDateString() === new Date().toDateString() ? 'text-orange-400' :
                        'text-[#c9a84c]'
                      }`}>
                        {diasAte(prazo.dataLimite)}
                      </p>
                      <p className="text-xs text-[#6b8a6f]">{formatarData(prazo.dataLimite)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Próximos Agendamentos */}
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl">
          <div className="px-5 py-4 border-b border-[#2a3f2e] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Próximos Agendamentos</h3>
            <Link href="/painel/agenda" className="text-xs text-[#c9a84c] hover:text-[#d4b55a]">Ver agenda</Link>
          </div>
          <div className="divide-y divide-[#2a3f2e]/50">
            {data.proximosAgendamentos.length === 0 ? (
              <p className="px-5 py-8 text-center text-[#6b8a6f] text-sm">Nenhum agendamento próximo</p>
            ) : (
              data.proximosAgendamentos.map(ag => (
                <div key={ag.id} className="px-5 py-3 hover:bg-[#1a2e1f]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{ag.titulo}</p>
                      <p className="text-xs text-[#6b8a6f] mt-0.5">{ag.cliente?.nome || 'Sem cliente vinculado'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[#c9a84c] font-medium">{formatarDataHora(ag.dataHora)}</p>
                      <StatusBadge status={ag.status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Triagens (Chatbot) */}
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl lg:col-span-2">
          <div className="px-5 py-4 border-b border-[#2a3f2e] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Triagens Recentes do Chatbot
              {stats.triagensNovas > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[#c9a84c]/20 text-[#c9a84c]">
                  {stats.triagensNovas} nova(s)
                </span>
              )}
            </h3>
            <Link href="/painel/triagem" className="text-xs text-[#c9a84c] hover:text-[#d4b55a]">Ver todas</Link>
          </div>
          <div className="divide-y divide-[#2a3f2e]/50">
            {data.ultimasTriagens.length === 0 ? (
              <p className="px-5 py-8 text-center text-[#6b8a6f] text-sm">Nenhuma triagem nova do chatbot</p>
            ) : (
              data.ultimasTriagens.map(triagem => (
                <div key={triagem.id} className="px-5 py-3 hover:bg-[#1a2e1f]/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{triagem.nome}</p>
                      <p className="text-xs text-[#6b8a6f]">{triagem.telefone} | Área: {triagem.area}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={triagem.urgencia === 'alta' ? 'urgente' : triagem.urgencia === 'media' ? 'alta' : 'normal'} />
                      <span className="text-xs text-[#6b8a6f]">{formatarData(triagem.criadoEm)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
