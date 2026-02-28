'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/painel/StatusBadge'

interface Resumo {
  totalRecebido: number; totalPendente: number; totalAtrasado: number
  parcelasAtrasadas: number; parcelasPendentes: number; parcelasPagas: number
}

interface Pagamento {
  id: string; descricao: string; valorTotal: number; formaPagamento: string | null
  status: string; criadoEm: string
  cliente: { id: string; nome: string }
  processo: { id: string; numero: string | null; assunto: string } | null
  parcelas: Parcela[]
}

interface Parcela {
  id: string; numero: number; valor: number; dataVencimento: string
  dataPagamento: string | null; status: string
}

export default function FinanceiroPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/financeiro')
      const data = await res.json()
      setPagamentos(data.pagamentos || [])
      setResumo(data.resumo || null)
    } finally { setLoading(false) }
  }

  const pagarParcela = async (pagamentoId: string, parcelaId: string) => {
    await fetch(`/api/financeiro/${pagamentoId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelaId, dataPagamento: new Date().toISOString() }),
    })
    carregar()
  }

  const formatarMoeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-[#6b8a6f] text-sm mt-1">Gestão de pagamentos e parcelas</p>
      </div>

      {/* Summary Cards */}
      {resumo && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Recebido', valor: formatarMoeda(resumo.totalRecebido), cor: 'border-green-600/30 bg-green-900/10', txt: 'text-green-400' },
            { label: 'Pendente', valor: formatarMoeda(resumo.totalPendente), cor: 'border-yellow-600/30 bg-yellow-900/10', txt: 'text-yellow-400' },
            { label: 'Atrasado', valor: formatarMoeda(resumo.totalAtrasado), cor: 'border-red-600/30 bg-red-900/10', txt: 'text-red-400' },
            { label: 'Parcelas Pagas', valor: String(resumo.parcelasPagas), cor: 'border-green-600/30 bg-green-900/10', txt: 'text-green-400' },
            { label: 'Parc. Pendentes', valor: String(resumo.parcelasPendentes), cor: 'border-yellow-600/30 bg-yellow-900/10', txt: 'text-yellow-400' },
            { label: 'Parc. Atrasadas', valor: String(resumo.parcelasAtrasadas), cor: 'border-red-600/30 bg-red-900/10', txt: 'text-red-400' },
          ].map(c => (
            <div key={c.label} className={`rounded-xl p-4 border ${c.cor}`}>
              <p className="text-[10px] uppercase text-[#8a9f8e]">{c.label}</p>
              <p className={`text-lg font-bold mt-1 ${c.txt}`}>{c.valor}</p>
            </div>
          ))}
        </div>
      )}

      {/* Export */}
      <div className="flex gap-2">
        <a href="/api/exportar?tipo=financeiro&formato=csv" className="px-3 py-1.5 text-xs bg-[#0e1810] border border-[#2a3f2e] text-[#8a9f8e] rounded-lg hover:text-white">Exportar CSV</a>
        <a href="/api/exportar?tipo=financeiro&formato=json" className="px-3 py-1.5 text-xs bg-[#0e1810] border border-[#2a3f2e] text-[#8a9f8e] rounded-lg hover:text-white">Exportar JSON</a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
      ) : pagamentos.length === 0 ? (
        <p className="text-center text-[#6b8a6f] py-12">Nenhum pagamento registrado</p>
      ) : (
        <div className="space-y-3">
          {pagamentos.map(pag => (
            <div key={pag.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl overflow-hidden">
              <button onClick={() => setExpandido(expandido === pag.id ? null : pag.id)}
                className="w-full p-4 text-left hover:bg-[#1a2e1f]/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{pag.descricao}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#6b8a6f]">
                      <a href={`/painel/clientes/${pag.cliente.id}`} className="text-[#c9a84c] hover:underline">{pag.cliente.nome}</a>
                      {pag.processo && <>
                        <span>•</span>
                        <a href={`/painel/processos/${pag.processo.id}`} className="hover:text-white">{pag.processo.numero || pag.processo.assunto}</a>
                      </>}
                      {pag.formaPagamento && <><span>•</span><span className="capitalize">{pag.formaPagamento}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={pag.status} />
                    <p className="text-sm font-bold text-white">{formatarMoeda(pag.valorTotal)}</p>
                    <svg className={`w-4 h-4 text-[#6b8a6f] transition-transform ${expandido === pag.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {expandido === pag.id && pag.parcelas.length > 0 && (
                <div className="border-t border-[#2a3f2e] p-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[#6b8a6f]">
                        <th className="text-left py-1 font-medium">Parcela</th>
                        <th className="text-left py-1 font-medium">Vencimento</th>
                        <th className="text-left py-1 font-medium">Valor</th>
                        <th className="text-left py-1 font-medium">Pagamento</th>
                        <th className="text-left py-1 font-medium">Status</th>
                        <th className="text-right py-1 font-medium">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pag.parcelas.map(parc => {
                        const vencida = parc.status === 'pendente' && new Date(parc.dataVencimento) < new Date()
                        return (
                          <tr key={parc.id} className={`border-t border-[#2a3f2e]/50 ${vencida ? 'bg-red-950/10' : ''}`}>
                            <td className="py-2 text-white">{parc.numero}/{pag.parcelas.length}</td>
                            <td className="py-2 text-[#b0c4b4]">{new Date(parc.dataVencimento).toLocaleDateString('pt-BR')}</td>
                            <td className="py-2 text-white font-medium">{formatarMoeda(parc.valor)}</td>
                            <td className="py-2 text-[#b0c4b4]">{parc.dataPagamento ? new Date(parc.dataPagamento).toLocaleDateString('pt-BR') : '—'}</td>
                            <td className="py-2"><StatusBadge status={vencida ? 'atrasado' : parc.status} /></td>
                            <td className="py-2 text-right">
                              {(parc.status === 'pendente' || vencida) && (
                                <button onClick={() => pagarParcela(pag.id, parc.id)}
                                  className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded border border-green-700/30 hover:bg-green-900/50">
                                  Pagar
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
