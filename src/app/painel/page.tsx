'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import StatsCard from '@/components/painel/StatsCard'
import StatusBadge from '@/components/painel/StatusBadge'

interface DashboardData {
  stats: {
    totalClientes: number; totalProcessos: number; processosAtivos: number
    prazosHoje: number; prazosSemana: number; prazosVencidos: number
    agendamentosHoje: number; triagensNovas: number; parcelasAtrasadas: number
    totalRecebido: number; totalPendente: number; clientesPorMes: number
    agendamentosPendentes: number
  }
  proximosPrazos: Array<{
    id: string; titulo: string; dataLimite: string; prioridade: string
    processo: { numero: string; assunto: string; cliente: { nome: string } }
  }>
  proximosAgendamentos: Array<{
    id: string; titulo: string; dataHora: string; tipo: string; status: string
    observacoes: string | null; cliente: { nome: string; telefone: string } | null
  }>
  ultimasTriagens: Array<{
    id: string; nome: string; telefone: string; area: string; urgencia: string; criadoEm: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const carregarDados = useCallback(async () => {
    try {
      const r = await fetch('/api/dashboard')
      if (!r.ok) throw new Error('Falha ao carregar')
      const d = await r.json()
      setData(d)
      setLastRefresh(new Date())
      setErro('')
    } catch {
      setErro('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
    const interval = setInterval(carregarDados, 60000) // Auto-refresh 60s
    return () => clearInterval(interval)
  }, [carregarDados])

  const formatarData = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

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

  const aprovarEWhatsApp = async (id: string, telefone: string, nome: string, dataHora: string, tipo: string) => {
    await fetch(`/api/agenda/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'confirmado' }) })
    if (telefone) {
      const msg = encodeURIComponent(`Prezado(a) ${nome},\n\nConfirmamos seu agendamento:\n\n📅 ${formatarDataHora(dataHora)}\n📋 Tipo: ${tipo}\n\nCerbelera & Oliveira Advogados\n📞 (18) 99610-1884`)
      window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${msg}`, '_blank')
    }
    carregarDados()
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
          <button onClick={() => { setLoading(true); carregarDados() }} className="px-4 py-2 text-sm bg-[#1a2e1f] text-[#c9a84c] rounded-lg border border-[#2a3f2e] hover:border-[#c9a84c]/30">
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const { stats } = data
  const agendamentosPendentes = data.proximosAgendamentos.filter(a => a.status === 'pendente')
  const horaRefresh = lastRefresh.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[#7a9f7e] text-sm font-medium">Visão geral do escritório</p>
            <span className="text-[10px] text-[#5a7b5e] flex items-center gap-1.5 bg-[#0e1810] px-2.5 py-1 rounded-full border border-[#1e3323]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Atualizado {horaRefresh}
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button onClick={() => { setLoading(true); carregarDados() }} className="px-4 py-2.5 text-xs bg-[#0e1810] border border-[#1e3323] text-[#8a9f8e] rounded-xl hover:text-white hover:border-[#c9a84c]/30 flex items-center gap-2 transition-all duration-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Atualizar
          </button>
          <Link href="/painel/clientes" className="px-5 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-semibold rounded-xl hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all shadow-lg shadow-[#c9a84c]/15 active:scale-[0.98]">
            + Novo Cliente
          </Link>
        </div>
      </div>

      {/* Alertas */}
      {(stats.prazosVencidos > 0 || stats.agendamentosPendentes > 0 || stats.triagensNovas > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.prazosVencidos > 0 && (
            <Link href="/painel/prazos" className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-800/25 rounded-2xl hover:bg-red-950/30 transition-all duration-200 group">
              <div className="w-11 h-11 bg-red-900/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-400">{stats.prazosVencidos} prazo(s) vencido(s)</p>
                <p className="text-[10px] text-red-400/50 font-medium">Requer atenção imediata</p>
              </div>
            </Link>
          )}
          {stats.agendamentosPendentes > 0 && (
            <Link href="/painel/agenda" className="flex items-center gap-3 p-4 bg-yellow-950/20 border border-yellow-800/25 rounded-2xl hover:bg-yellow-950/30 transition-all duration-200 group">
              <div className="w-11 h-11 bg-yellow-900/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-lg">⏳</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-400">{stats.agendamentosPendentes} agendamento(s) pendente(s)</p>
                <p className="text-[10px] text-yellow-400/50 font-medium">Aguardando aprovação</p>
              </div>
            </Link>
          )}
          {stats.triagensNovas > 0 && (
            <Link href="/painel/triagem" className="flex items-center gap-3 p-4 bg-[#c9a84c]/8 border border-[#c9a84c]/20 rounded-2xl hover:bg-[#c9a84c]/12 transition-all duration-200 group">
              <div className="w-11 h-11 bg-[#c9a84c]/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#c9a84c]">{stats.triagensNovas} triagem(ns) nova(s)</p>
                <p className="text-[10px] text-[#c9a84c]/50 font-medium">Do chatbot ou formulário</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard titulo="Clientes Ativos" valor={stats.totalClientes} subtitulo={`+${stats.clientesPorMes} este mês`} cor="gold"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        <StatsCard titulo="Processos Ativos" valor={stats.processosAtivos} subtitulo={`${stats.totalProcessos} total`} cor="blue"
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <StatsCard titulo="Agendamentos Hoje" valor={stats.agendamentosHoje} subtitulo={`${stats.agendamentosPendentes} pendente(s)`} cor="green"
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <StatsCard titulo="Prazos" valor={stats.prazosHoje} subtitulo={`${stats.prazosSemana} na semana | ${stats.prazosVencidos} vencidos`}
          cor={stats.prazosVencidos > 0 ? 'red' : 'green'}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard titulo="Total Recebido" valor={formatarMoeda(stats.totalRecebido)} cor="green"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatsCard titulo="Total Pendente" valor={formatarMoeda(stats.totalPendente)} cor="orange"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatsCard titulo="Parcelas Atrasadas" valor={stats.parcelasAtrasadas} cor={stats.parcelasAtrasadas > 0 ? 'red' : 'green'}
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </div>

      {/* Aprovações Pendentes (Quick Actions) */}
      {agendamentosPendentes.length > 0 && (
        <div className="bg-[#0e1810] border border-yellow-800/20 rounded-2xl shadow-lg shadow-black/20">
          <div className="px-6 py-4 border-b border-[#1e3323] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-900/25 flex items-center justify-center">
                <span className="text-sm">⏳</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Aprovações Pendentes</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-yellow-900/20 text-yellow-400 border border-yellow-800/30 font-bold">{agendamentosPendentes.length}</span>
            </div>
            <Link href="/painel/agenda" className="text-xs text-[#c9a84c] hover:text-[#d4b55a] font-medium">Ver agenda →</Link>
          </div>
          <div className="divide-y divide-[#1e3323]/50">
            {agendamentosPendentes.slice(0, 5).map(ag => {
              const nomeCliente = ag.cliente?.nome || ag.titulo.match(/- (.+)$/)?.[1] || 'Cliente'
              const telCliente = ag.cliente?.telefone || ag.observacoes?.match(/Telefone:\s*(\d+)/)?.[1] || ''
              const isVindoDoSite = ag.observacoes?.includes('Agendamento via site')
              return (
                <div key={ag.id} className="px-6 py-4 hover:bg-[#1a2e1f]/30 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{ag.titulo}</p>
                        {isVindoDoSite && <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-purple-900/20 text-purple-400 border border-purple-800/30 font-medium">🌐 Site</span>}
                      </div>
                      <p className="text-xs text-[#5a7b5e] mt-1 font-medium">{formatarDataHora(ag.dataHora)} • {ag.tipo}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {telCliente && (
                        <button onClick={() => aprovarEWhatsApp(ag.id, telCliente, nomeCliente, ag.dataHora, ag.tipo)}
                          className="px-3 py-1.5 text-[11px] font-semibold bg-green-900/20 text-green-400 border border-green-800/30 rounded-xl hover:bg-green-900/40 flex items-center gap-1.5 cursor-pointer transition-all">
                          ✅ Aprovar + WhatsApp
                        </button>
                      )}
                      <button onClick={() => aprovarEWhatsApp(ag.id, '', nomeCliente, ag.dataHora, ag.tipo)} className="px-3 py-1.5 text-[11px] font-semibold bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/25 rounded-xl hover:bg-[#c9a84c]/25 transition-all">
                        ✅ Aprovar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Prazos */}
        <div className="bg-[#0e1810] border border-[#1e3323] rounded-2xl shadow-lg shadow-black/20">
          <div className="px-6 py-4 border-b border-[#1e3323] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Próximos Prazos</h3>
              {stats.prazosVencidos > 0 && <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-red-900/20 text-red-400 border border-red-800/30 font-bold">{stats.prazosVencidos} vencido(s)</span>}
            </div>
            <Link href="/painel/prazos" className="text-xs text-[#c9a84c] hover:text-[#d4b55a] font-medium">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[#1e3323]/50">
            {data.proximosPrazos.length === 0 ? (
              <p className="px-6 py-10 text-center text-[#5a7b5e] text-sm font-medium">Nenhum prazo pendente ✅</p>
            ) : (
              data.proximosPrazos.map(prazo => {
                const vencido = new Date(prazo.dataLimite) < new Date()
                const hoje = new Date(prazo.dataLimite).toDateString() === new Date().toDateString()
                return (
                  <div key={prazo.id} className={`px-6 py-4 hover:bg-[#1a2e1f]/30 transition-colors ${vencido ? 'bg-red-950/10' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">{prazo.titulo}</p>
                        <p className="text-xs text-[#5a7b5e] mt-1 font-medium">
                          {prazo.processo.cliente.nome} • {prazo.processo.numero || prazo.processo.assunto}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-bold ${vencido ? 'text-red-400' : hoje ? 'text-orange-400' : 'text-[#c9a84c]'}`}>
                          {diasAte(prazo.dataLimite)}
                        </p>
                        <p className="text-[10px] text-[#4a6b4e] font-medium">{formatarData(prazo.dataLimite)}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Próximos Agendamentos */}
        <div className="bg-[#0e1810] border border-[#1e3323] rounded-2xl shadow-lg shadow-black/20">
          <div className="px-6 py-4 border-b border-[#1e3323] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Próximos Agendamentos</h3>
            </div>
            <Link href="/painel/agenda" className="text-xs text-[#c9a84c] hover:text-[#d4b55a] font-medium">Ver agenda →</Link>
          </div>
          <div className="divide-y divide-[#1e3323]/50">
            {data.proximosAgendamentos.length === 0 ? (
              <p className="px-6 py-10 text-center text-[#5a7b5e] text-sm font-medium">Nenhum agendamento próximo</p>
            ) : (
              data.proximosAgendamentos.map(ag => (
                <div key={ag.id} className="px-6 py-4 hover:bg-[#1a2e1f]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{ag.titulo}</p>
                        {ag.observacoes?.includes('Agendamento via site') && (
                          <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-purple-900/20 text-purple-400 border border-purple-800/30 font-bold">🌐</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5a7b5e] mt-1 font-medium">{ag.cliente?.nome || 'Sem cliente vinculado'}</p>
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

        {/* Últimas Triagens (Chatbot + Contato) */}
        <div className="bg-[#0e1810] border border-[#1e3323] rounded-2xl shadow-lg shadow-black/20 lg:col-span-2">
          <div className="px-6 py-4 border-b border-[#1e3323] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Novas Triagens e Contatos</h3>
              {stats.triagensNovas > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#c9a84c]/15 text-[#c9a84c] font-bold">{stats.triagensNovas}</span>
              )}
            </div>
            <Link href="/painel/triagem" className="text-xs text-[#c9a84c] hover:text-[#d4b55a] font-medium">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[#1e3323]/50">
            {data.ultimasTriagens.length === 0 ? (
              <p className="px-6 py-10 text-center text-[#5a7b5e] text-sm font-medium">Nenhuma triagem nova</p>
            ) : (
              data.ultimasTriagens.map(triagem => {
                const isContato = triagem.area.includes('Contato')
                return (
                  <div key={triagem.id} className="px-6 py-4 hover:bg-[#1a2e1f]/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{triagem.nome}</p>
                          {isContato ? (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-blue-900/20 text-blue-400 border border-blue-800/30 font-medium">📧 Contato</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-purple-900/20 text-purple-400 border border-purple-800/30 font-medium">🤖 Chatbot</span>
                          )}
                        </div>
                        <p className="text-xs text-[#5a7b5e] font-medium mt-1">{triagem.telefone || 'Sem telefone'} • {triagem.area}</p>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <StatusBadge status={triagem.urgencia === 'alta' ? 'urgente' : triagem.urgencia === 'media' ? 'alta' : 'normal'} />
                        <span className="text-[10px] text-[#4a6b4e] font-medium">{formatarData(triagem.criadoEm)}</span>
                        {triagem.telefone && (
                          <a href={`https://wa.me/55${triagem.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-green-500/60 hover:text-green-400 hover:bg-green-900/20" title="WhatsApp">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/painel/agenda', label: 'Nova Consulta', icon: '📅', cor: 'border-[#c9a84c]/15 hover:border-[#c9a84c]/35 hover:bg-[#c9a84c]/5' },
          { href: '/painel/processos', label: 'Novo Processo', icon: '📋', cor: 'border-blue-800/20 hover:border-blue-700/35 hover:bg-blue-950/15' },
          { href: '/painel/triagem', label: 'Ver Triagens', icon: '💬', cor: 'border-purple-800/20 hover:border-purple-700/35 hover:bg-purple-950/15' },
          { href: '/painel/financeiro', label: 'Financeiro', icon: '💰', cor: 'border-emerald-800/20 hover:border-emerald-700/35 hover:bg-emerald-950/15' },
        ].map(a => (
          <Link key={a.href} href={a.href} className={`flex items-center gap-3 p-4 bg-[#0e1810] border rounded-2xl transition-all duration-200 group ${a.cor}`}>
            <span className="text-xl group-hover:scale-110 transition-transform">{a.icon}</span>
            <span className="text-sm text-[#b0c4b4] font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
