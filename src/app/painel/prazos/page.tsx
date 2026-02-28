'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/painel/StatusBadge'

interface Prazo {
  id: string; titulo: string; descricao: string | null; dataLimite: string
  tipo: string; status: string; prioridade: string; alertaEnviado: boolean
  processo: { id: string; numero: string | null; assunto: string; cliente: { id: string; nome: string } }
}

export default function PrazosPage() {
  const [prazos, setPrazos] = useState<Prazo[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos') // todos, hoje, semana, vencidos

  useEffect(() => { carregar() }, [filtro])

  const carregar = async () => {
    setLoading(true)
    try {
      let url = '/api/prazos?limite=100'
      if (filtro === 'hoje') url += '&periodo=hoje'
      else if (filtro === 'semana') url += '&periodo=semana'
      else if (filtro === 'vencidos') url += '&periodo=vencidos'
      const res = await fetch(url)
      const data = await res.json()
      setPrazos(data.prazos || [])
    } finally { setLoading(false) }
  }

  const marcarCumprido = async (id: string) => {
    await fetch(`/api/prazos/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cumprido' }),
    })
    carregar()
  }

  const diasRestantes = (data: string) => {
    const diff = Math.ceil((new Date(data).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { texto: `${Math.abs(diff)} dia(s) atrás`, cor: 'text-red-400' }
    if (diff === 0) return { texto: 'Hoje', cor: 'text-yellow-400' }
    if (diff <= 3) return { texto: `${diff} dia(s)`, cor: 'text-orange-400' }
    if (diff <= 7) return { texto: `${diff} dias`, cor: 'text-yellow-300' }
    return { texto: `${diff} dias`, cor: 'text-green-400' }
  }

  const corPrioridade: Record<string, string> = {
    urgente: 'bg-red-900/30 text-red-400 border-red-700',
    alta: 'bg-orange-900/30 text-orange-400 border-orange-700',
    normal: 'bg-blue-900/30 text-blue-400 border-blue-700',
    baixa: 'bg-gray-800/50 text-gray-400 border-gray-600',
  }

  const prazosPendentes = prazos.filter(p => p.status === 'pendente')
  const prazosCumpridos = prazos.filter(p => p.status === 'cumprido')
  const prazosVencidos = prazosPendentes.filter(p => new Date(p.dataLimite) < new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prazos Processuais</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">
            {prazosPendentes.length} pendente(s) • {prazosVencidos.length} vencido(s)
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Vencendo Hoje', v: prazos.filter(p => p.status === 'pendente' && diasRestantes(p.dataLimite).texto === 'Hoje').length, cor: 'border-yellow-600/30 bg-yellow-900/10' },
          { label: 'Esta Semana', v: prazosPendentes.filter(p => { const d = Math.ceil((new Date(p.dataLimite).getTime() - Date.now()) / 86400000); return d >= 0 && d <= 7 }).length, cor: 'border-blue-600/30 bg-blue-900/10' },
          { label: 'Vencidos', v: prazosVencidos.length, cor: 'border-red-600/30 bg-red-900/10' },
          { label: 'Cumpridos', v: prazosCumpridos.length, cor: 'border-green-600/30 bg-green-900/10' },
        ].map(card => (
          <div key={card.label} className={`rounded-xl p-4 border ${card.cor}`}>
            <p className="text-xs text-[#8a9f8e]">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'todos', label: 'Todos' }, { value: 'hoje', label: 'Hoje' },
          { value: 'semana', label: 'Esta Semana' }, { value: 'vencidos', label: 'Vencidos' },
        ].map(f => (
          <button key={f.value} onClick={() => setFiltro(f.value)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filtro === f.value ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'bg-[#0e1810] text-[#8a9f8e] border border-[#2a3f2e] hover:text-white'
            }`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
      ) : prazos.length === 0 ? (
        <p className="text-center text-[#6b8a6f] py-12">Nenhum prazo encontrado</p>
      ) : (
        <div className="space-y-3">
          {prazos.map(prazo => {
            const info = diasRestantes(prazo.dataLimite)
            const vencido = prazo.status === 'pendente' && new Date(prazo.dataLimite) < new Date()
            return (
              <div key={prazo.id} className={`bg-[#0e1810] border rounded-xl p-4 transition-colors ${
                vencido ? 'border-red-800/50 bg-red-950/10' : 'border-[#2a3f2e] hover:border-[#c9a84c]/30'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${corPrioridade[prazo.prioridade] || corPrioridade.normal}`}>
                        {prazo.prioridade}
                      </span>
                      <StatusBadge status={prazo.status} />
                    </div>
                    <p className="text-sm font-medium text-white">{prazo.titulo}</p>
                    {prazo.descricao && <p className="text-xs text-[#6b8a6f] mt-0.5">{prazo.descricao}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6b8a6f]">
                      <span className="capitalize">{prazo.tipo}</span>
                      <span>•</span>
                      <a href={`/painel/processos/${prazo.processo.id}`} className="text-[#c9a84c] hover:underline">
                        {prazo.processo.numero || prazo.processo.assunto}
                      </a>
                      <span>•</span>
                      <span>{prazo.processo.cliente.nome}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className={`text-sm font-medium ${info.cor}`}>{info.texto}</p>
                    <p className="text-xs text-[#6b8a6f]">{new Date(prazo.dataLimite).toLocaleDateString('pt-BR')}</p>
                    {prazo.status === 'pendente' && (
                      <button onClick={() => marcarCumprido(prazo.id)}
                        className="px-3 py-1 text-xs bg-green-900/30 text-green-400 rounded-lg border border-green-700/30 hover:bg-green-900/50 transition-colors">
                        Cumprido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
