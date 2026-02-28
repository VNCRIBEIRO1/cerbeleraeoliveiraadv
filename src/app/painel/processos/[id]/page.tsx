'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface ProcessoDetalhes {
  id: string; numero: string | null; tipo: string; assunto: string; descricao: string | null
  status: string; vara: string | null; comarca: string | null; foro: string | null
  valorCausa: number | null; parteContraria: string | null; advContrario: string | null
  dataDistribuicao: string | null; dataConclusao: string | null; observacoes: string | null; criadoEm: string
  cliente: { id: string; nome: string; telefone: string }
  advogado: { id: string; nome: string } | null
  prazos: Array<{ id: string; titulo: string; descricao: string | null; dataLimite: string; tipo: string; status: string; prioridade: string }>
  andamentos: Array<{ id: string; descricao: string; data: string; tipo: string }>
  pagamentos: Array<{ id: string; descricao: string; valorTotal: number; status: string; parcelas: Array<{ id: string; numero: number; valor: number; dataVencimento: string; dataPagamento: string | null; status: string }> }>
  documentos: Array<{ id: string; nome: string; tipo: string; criadoEm: string }>
}

export default function ProcessoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [processo, setProcesso] = useState<ProcessoDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('andamentos')
  const [modalPrazo, setModalPrazo] = useState(false)
  const [modalAndamento, setModalAndamento] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalPagamento, setModalPagamento] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const [formPrazo, setFormPrazo] = useState({ titulo: '', descricao: '', dataLimite: '', tipo: 'outro', prioridade: 'normal' })
  const [formAndamento, setFormAndamento] = useState({ descricao: '', tipo: 'outro', data: '' })
  const [formEditar, setFormEditar] = useState({
    numero: '', tipo: '', assunto: '', descricao: '', status: '',
    vara: '', comarca: '', foro: '', valorCausa: '',
    parteContraria: '', advContrario: '', dataDistribuicao: '', observacoes: '',
  })
  const [formPagamento, setFormPagamento] = useState({
    descricao: '', valorTotal: '', formaPagamento: 'avista', numParcelas: '1',
  })

  const recarregar = () => fetch(`/api/processos/${id}`).then(r => r.json()).then(setProcesso)

  useEffect(() => {
    recarregar().finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const formatarData = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
  const formatarMoeda = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  /* ========================= EDITAR ========================= */
  const abrirEditar = () => {
    if (!processo) return
    setFormEditar({
      numero: processo.numero || '', tipo: processo.tipo, assunto: processo.assunto,
      descricao: processo.descricao || '', status: processo.status,
      vara: processo.vara || '', comarca: processo.comarca || '', foro: processo.foro || '',
      valorCausa: processo.valorCausa?.toString() || '',
      parteContraria: processo.parteContraria || '', advContrario: processo.advContrario || '',
      dataDistribuicao: processo.dataDistribuicao ? processo.dataDistribuicao.split('T')[0] : '',
      observacoes: processo.observacoes || '',
    })
    setModalEditar(true)
  }

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      const res = await fetch(`/api/processos/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formEditar, valorCausa: formEditar.valorCausa || null, dataDistribuicao: formEditar.dataDistribuicao || null }),
      })
      if (res.ok) { setModalEditar(false); recarregar() }
    } finally { setSalvando(false) }
  }

  /* ========================= EXCLUIR ========================= */
  const excluirProcesso = async () => {
    if (!processo) return
    if (!confirm(`ATENÇÃO: Excluir "${processo.numero || processo.assunto}"?\n\nTodos prazos, andamentos e documentos vinculados serão removidos.\n\nEsta ação NÃO pode ser desfeita.`)) return
    const res = await fetch(`/api/processos/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/painel/processos')
    else alert('Erro ao excluir')
  }

  /* ========================= PRAZO ========================= */
  const salvarPrazo = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      await fetch('/api/prazos', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formPrazo, processoId: id }) })
      setModalPrazo(false); recarregar()
    } finally { setSalvando(false) }
  }

  const cumprirPrazo = async (prazoId: string) => {
    await fetch(`/api/prazos/${prazoId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cumprido' }) })
    recarregar()
  }

  const excluirPrazo = async (prazoId: string) => {
    if (!confirm('Excluir este prazo?')) return
    await fetch(`/api/prazos/${prazoId}`, { method: 'DELETE' })
    recarregar()
  }

  /* ========================= ANDAMENTO ========================= */
  const salvarAndamento = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      await fetch(`/api/processos/${id}/andamentos`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formAndamento) })
      setModalAndamento(false); recarregar()
    } finally { setSalvando(false) }
  }

  /* ========================= PAGAMENTO ========================= */
  const salvarPagamento = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      const numP = parseInt(formPagamento.numParcelas) || 1
      const total = parseFloat(formPagamento.valorTotal)
      const valorP = total / numP
      const parcelas = Array.from({ length: numP }, (_, i) => {
        const venc = new Date(); venc.setMonth(venc.getMonth() + i + 1)
        return { numero: i + 1, valor: parseFloat(valorP.toFixed(2)), dataVencimento: venc.toISOString() }
      })
      const res = await fetch('/api/financeiro', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao: formPagamento.descricao, valorTotal: total, formaPagamento: formPagamento.formaPagamento, clienteId: processo?.cliente.id, processoId: id, parcelas }),
      })
      if (res.ok) { setModalPagamento(false); recarregar() }
    } finally { setSalvando(false) }
  }

  const pagarParcela = async (pagamentoId: string, parcelaId: string) => {
    await fetch(`/api/financeiro/${pagamentoId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelaId, parcelaStatus: 'pago' }) })
    recarregar()
  }

  /* ========================= CONSULTA EXTERNA ========================= */
  const consultarProcesso = (numero: string) => {
    window.open(`https://www.jusbrasil.com.br/consulta-processual/busca?q=${encodeURIComponent(numero)}`, '_blank')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-3 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
  if (!processo) return <p className="text-red-400 text-center py-12">Processo não encontrado</p>

  const totalFinanceiro = processo.pagamentos.reduce((a, p) => a + p.valorTotal, 0)
  const totalPago = processo.pagamentos.reduce((a, p) => a + p.parcelas.filter(pa => pa.status === 'pago').reduce((s, pa) => s + pa.valor, 0), 0)
  const prazosVencidos = processo.prazos.filter(p => p.status === 'pendente' && new Date(p.dataLimite) < new Date()).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/painel/processos')} className="text-[#c9a84c] hover:underline">Processos</button>
        <span className="text-[#6b8a6f]">/</span>
        <span className="text-[#b0c4b4]">{processo.numero || processo.assunto}</span>
      </div>

      {/* Process Info Card */}
      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-xl font-bold text-white">{processo.numero || 'Processo sem número'}</h1>
              <StatusBadge status={processo.status} />
              {prazosVencidos > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-700/30">
                  {prazosVencidos} prazo(s) vencido(s)
                </span>
              )}
            </div>
            <p className="text-sm text-[#d0dcd2] mb-3">{processo.assunto}</p>
            {processo.descricao && <p className="text-xs text-[#6b8a6f] mb-3 italic">{processo.descricao}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <p className="text-[#8a9f8e]">Cliente: <button onClick={() => router.push(`/painel/clientes/${processo.cliente.id}`)} className="text-[#c9a84c] hover:underline">{processo.cliente.nome}</button></p>
              <p className="text-[#8a9f8e]">Tipo: <span className="text-[#d0dcd2] capitalize">{processo.tipo}</span></p>
              <p className="text-[#8a9f8e]">Vara: <span className="text-[#d0dcd2]">{processo.vara || '-'}</span></p>
              <p className="text-[#8a9f8e]">Comarca: <span className="text-[#d0dcd2]">{processo.comarca || '-'}</span></p>
              {processo.foro && <p className="text-[#8a9f8e]">Foro: <span className="text-[#d0dcd2]">{processo.foro}</span></p>}
              <p className="text-[#8a9f8e]">Valor: <span className="text-[#d0dcd2]">{processo.valorCausa ? formatarMoeda(processo.valorCausa) : '-'}</span></p>
              {processo.parteContraria && <p className="text-[#8a9f8e]">Parte contrária: <span className="text-[#d0dcd2]">{processo.parteContraria}</span></p>}
              {processo.advContrario && <p className="text-[#8a9f8e]">Adv. contrário: <span className="text-[#d0dcd2]">{processo.advContrario}</span></p>}
              <p className="text-[#8a9f8e]">Distribuição: <span className="text-[#d0dcd2]">{processo.dataDistribuicao ? formatarData(processo.dataDistribuicao) : '-'}</span></p>
              <p className="text-[#8a9f8e]">Desde: <span className="text-[#d0dcd2]">{formatarData(processo.criadoEm)}</span></p>
              {processo.advogado && <p className="text-[#8a9f8e]">Advogado: <span className="text-[#d0dcd2]">{processo.advogado.nome}</span></p>}
            </div>
            {processo.observacoes && <p className="text-xs text-[#6b8a6f] mt-3 italic border-t border-[#2a3f2e] pt-3">Obs: {processo.observacoes}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {processo.numero && (
              <button onClick={() => consultarProcesso(processo.numero!)}
                className="px-3 py-2 text-xs bg-blue-900/20 border border-blue-700/30 text-blue-400 rounded-lg hover:bg-blue-900/40 flex items-center gap-1.5" title="Consultar andamento no JusBrasil">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Consultar
              </button>
            )}
            <button onClick={abrirEditar}
              className="px-3 py-2 text-xs bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/20 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Editar
            </button>
            <button onClick={excluirProcesso}
              className="px-3 py-2 text-xs bg-red-900/20 border border-red-700/30 text-red-400 rounded-lg hover:bg-red-900/40 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Excluir
            </button>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#2a3f2e]">
          <div className="text-center"><p className="text-lg font-bold text-white">{processo.andamentos.length}</p><p className="text-[10px] text-[#6b8a6f] uppercase">Andamentos</p></div>
          <div className="text-center"><p className="text-lg font-bold text-white">{processo.prazos.length}</p><p className="text-[10px] text-[#6b8a6f] uppercase">Prazos</p></div>
          <div className="text-center"><p className="text-lg font-bold text-[#c9a84c]">{totalFinanceiro > 0 ? formatarMoeda(totalFinanceiro) : '-'}</p><p className="text-[10px] text-[#6b8a6f] uppercase">Valor Total</p></div>
          <div className="text-center"><p className="text-lg font-bold text-emerald-400">{totalPago > 0 ? formatarMoeda(totalPago) : '-'}</p><p className="text-[10px] text-[#6b8a6f] uppercase">Recebido</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-1">
        {[
          { key: 'andamentos', label: 'Andamentos', count: processo.andamentos.length },
          { key: 'prazos', label: 'Prazos', count: processo.prazos.length },
          { key: 'financeiro', label: 'Financeiro', count: processo.pagamentos.length },
        ].map(aba => (
          <button key={aba.key} onClick={() => setAbaAtiva(aba.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              abaAtiva === aba.key ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]'
            }`}>{aba.label} ({aba.count})</button>
        ))}
      </div>

      {/* ========================= ANDAMENTOS ========================= */}
      {abaAtiva === 'andamentos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => { setFormAndamento({ descricao: '', tipo: 'outro', data: '' }); setModalAndamento(true) }}>+ Novo Andamento</FormButton>
          </div>
          <div className="space-y-3">
            {processo.andamentos.map((and, i) => (
              <div key={and.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#c9a84c] flex-shrink-0" />
                  {i < processo.andamentos.length - 1 && <div className="w-0.5 flex-1 bg-[#2a3f2e]" />}
                </div>
                <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4 flex-1 mb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white">{and.descricao}</p>
                      <span className="text-xs text-[#8a9f8e] capitalize mt-1 inline-block px-2 py-0.5 bg-[#1a2e1f] rounded">{and.tipo}</span>
                    </div>
                    <span className="text-xs text-[#6b8a6f] flex-shrink-0">{formatarData(and.data)}</span>
                  </div>
                </div>
              </div>
            ))}
            {processo.andamentos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum andamento registrado</p>}
          </div>
        </div>
      )}

      {/* ========================= PRAZOS ========================= */}
      {abaAtiva === 'prazos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => { setFormPrazo({ titulo: '', descricao: '', dataLimite: '', tipo: 'outro', prioridade: 'normal' }); setModalPrazo(true) }}>+ Novo Prazo</FormButton>
          </div>
          <div className="space-y-3">
            {processo.prazos.map(p => {
              const vencido = p.status === 'pendente' && new Date(p.dataLimite) < new Date()
              const diasRestantes = Math.ceil((new Date(p.dataLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              return (
                <div key={p.id} className={`bg-[#0e1810] border rounded-xl p-4 ${vencido ? 'border-red-800/50 bg-red-950/10' : 'border-[#2a3f2e]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{p.titulo}</p>
                      {p.descricao && <p className="text-xs text-[#6b8a6f] mt-1">{p.descricao}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          p.prioridade === 'urgente' ? 'bg-red-900/30 text-red-400 border-red-700' :
                          p.prioridade === 'alta' ? 'bg-orange-900/30 text-orange-400 border-orange-700' :
                          p.prioridade === 'normal' ? 'bg-blue-900/30 text-blue-400 border-blue-700' :
                          'bg-gray-800/50 text-gray-400 border-gray-600'
                        }`}>{p.prioridade}</span>
                        <span className="text-xs text-[#8a9f8e] capitalize">{p.tipo}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-2">
                      <p className={`text-sm font-medium ${vencido ? 'text-red-400' : diasRestantes === 0 ? 'text-orange-400' : diasRestantes <= 3 ? 'text-yellow-400' : 'text-[#c9a84c]'}`}>
                        {vencido ? `${Math.abs(diasRestantes)}d atrás` : diasRestantes === 0 ? 'Hoje' : `${diasRestantes}d`}
                      </p>
                      <p className="text-xs text-[#6b8a6f]">{formatarData(p.dataLimite)}</p>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={p.status} />
                        {p.status === 'pendente' && (
                          <button onClick={() => cumprirPrazo(p.id)} className="px-2 py-1 text-[10px] bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/50">✓</button>
                        )}
                        <button onClick={() => excluirPrazo(p.id)} className="p-1 text-red-400/60 hover:text-red-400 hover:bg-red-900/20 rounded" title="Excluir">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {processo.prazos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum prazo</p>}
          </div>
        </div>
      )}

      {/* ========================= FINANCEIRO ========================= */}
      {abaAtiva === 'financeiro' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => { setFormPagamento({ descricao: '', valorTotal: '', formaPagamento: 'avista', numParcelas: '1' }); setModalPagamento(true) }}>+ Novo Pagamento</FormButton>
          </div>
          {processo.pagamentos.map(pag => (
            <div key={pag.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-sm font-medium text-white">{pag.descricao}</p><p className="text-xs text-[#6b8a6f]">Total: {formatarMoeda(pag.valorTotal)}</p></div>
                <StatusBadge status={pag.status} />
              </div>
              {pag.parcelas.length > 0 && (
                <div className="space-y-1.5">
                  {pag.parcelas.map(parc => {
                    const vencida = parc.status === 'pendente' && new Date(parc.dataVencimento) < new Date()
                    return (
                      <div key={parc.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${vencida ? 'bg-red-950/20' : 'bg-[#1a2e1f]'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#8a9f8e]">#{parc.numero}</span>
                          <span className="text-sm text-white">{formatarMoeda(parc.valor)}</span>
                          <span className="text-xs text-[#6b8a6f]">Venc: {formatarData(parc.dataVencimento)}</span>
                          {parc.dataPagamento && <span className="text-xs text-emerald-400">Pago: {formatarData(parc.dataPagamento)}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={vencida ? 'atrasado' : parc.status} />
                          {parc.status === 'pendente' && (
                            <button onClick={() => pagarParcela(pag.id, parc.id)}
                              className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/50">Pagar</button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
          {processo.pagamentos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum pagamento vinculado</p>}
        </div>
      )}

      {/* ========================= MODAL EDITAR ========================= */}
      <Modal aberto={modalEditar} onFechar={() => setModalEditar(false)} titulo="Editar Processo" tamanho="lg">
        <form onSubmit={salvarEdicao} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Número"><FormInput value={formEditar.numero} onChange={e => setFormEditar({...formEditar, numero: e.target.value})} placeholder="0000000-00.0000.0.00.0000" /></FormField>
            <FormField label="Área" obrigatorio>
              <FormSelect value={formEditar.tipo} onChange={e => setFormEditar({...formEditar, tipo: e.target.value})}>
                <option value="trabalhista">Trabalhista</option><option value="criminal">Criminal</option>
                <option value="civil">Civil</option><option value="empresarial">Empresarial</option>
                <option value="administrativo">Administrativo</option><option value="previdenciario">Previdenciário</option>
                <option value="familia">Família</option><option value="consumidor">Consumidor</option>
              </FormSelect>
            </FormField>
            <FormField label="Assunto" obrigatorio><FormInput value={formEditar.assunto} onChange={e => setFormEditar({...formEditar, assunto: e.target.value})} required /></FormField>
            <FormField label="Status">
              <FormSelect value={formEditar.status} onChange={e => setFormEditar({...formEditar, status: e.target.value})}>
                <option value="em_andamento">Em Andamento</option><option value="concluido">Concluído</option>
                <option value="suspenso">Suspenso</option><option value="arquivado">Arquivado</option>
              </FormSelect>
            </FormField>
            <FormField label="Valor da Causa"><FormInput type="number" step="0.01" value={formEditar.valorCausa} onChange={e => setFormEditar({...formEditar, valorCausa: e.target.value})} placeholder="0.00" /></FormField>
            <FormField label="Vara"><FormInput value={formEditar.vara} onChange={e => setFormEditar({...formEditar, vara: e.target.value})} placeholder="1ª Vara do Trabalho" /></FormField>
            <FormField label="Comarca"><FormInput value={formEditar.comarca} onChange={e => setFormEditar({...formEditar, comarca: e.target.value})} placeholder="Presidente Prudente/SP" /></FormField>
            <FormField label="Foro"><FormInput value={formEditar.foro} onChange={e => setFormEditar({...formEditar, foro: e.target.value})} /></FormField>
            <FormField label="Parte Contrária"><FormInput value={formEditar.parteContraria} onChange={e => setFormEditar({...formEditar, parteContraria: e.target.value})} /></FormField>
            <FormField label="Adv. Contrário"><FormInput value={formEditar.advContrario} onChange={e => setFormEditar({...formEditar, advContrario: e.target.value})} /></FormField>
            <FormField label="Data Distribuição"><FormInput type="date" value={formEditar.dataDistribuicao} onChange={e => setFormEditar({...formEditar, dataDistribuicao: e.target.value})} /></FormField>
          </div>
          <FormField label="Descrição"><FormTextarea value={formEditar.descricao} onChange={e => setFormEditar({...formEditar, descricao: e.target.value})} rows={3} /></FormField>
          <FormField label="Observações"><FormTextarea value={formEditar.observacoes} onChange={e => setFormEditar({...formEditar, observacoes: e.target.value})} rows={2} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalEditar(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar Alterações'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* ========================= MODAL PRAZO ========================= */}
      <Modal aberto={modalPrazo} onFechar={() => setModalPrazo(false)} titulo="Novo Prazo">
        <form onSubmit={salvarPrazo} className="space-y-4">
          <FormField label="Título" obrigatorio><FormInput value={formPrazo.titulo} onChange={e => setFormPrazo({...formPrazo, titulo: e.target.value})} required /></FormField>
          <FormField label="Data Limite" obrigatorio><FormInput type="date" value={formPrazo.dataLimite} onChange={e => setFormPrazo({...formPrazo, dataLimite: e.target.value})} required /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <FormSelect value={formPrazo.tipo} onChange={e => setFormPrazo({...formPrazo, tipo: e.target.value})}>
                <option value="recurso">Recurso</option><option value="manifestacao">Manifestação</option>
                <option value="audiencia">Audiência</option><option value="diligencia">Diligência</option><option value="outro">Outro</option>
              </FormSelect>
            </FormField>
            <FormField label="Prioridade">
              <FormSelect value={formPrazo.prioridade} onChange={e => setFormPrazo({...formPrazo, prioridade: e.target.value})}>
                <option value="baixa">Baixa</option><option value="normal">Normal</option>
                <option value="alta">Alta</option><option value="urgente">Urgente</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Descrição"><FormTextarea value={formPrazo.descricao} onChange={e => setFormPrazo({...formPrazo, descricao: e.target.value})} rows={2} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalPrazo(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Criar Prazo'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* ========================= MODAL ANDAMENTO ========================= */}
      <Modal aberto={modalAndamento} onFechar={() => setModalAndamento(false)} titulo="Novo Andamento">
        <form onSubmit={salvarAndamento} className="space-y-4">
          <FormField label="Descrição" obrigatorio><FormTextarea value={formAndamento.descricao} onChange={e => setFormAndamento({...formAndamento, descricao: e.target.value})} required rows={4} placeholder="Descreva o andamento processual" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <FormSelect value={formAndamento.tipo} onChange={e => setFormAndamento({...formAndamento, tipo: e.target.value})}>
                <option value="despacho">Despacho</option><option value="sentenca">Sentença</option>
                <option value="peticao">Petição</option><option value="audiencia">Audiência</option>
                <option value="diligencia">Diligência</option><option value="publicacao">Publicação</option>
                <option value="juntada">Juntada</option><option value="outro">Outro</option>
              </FormSelect>
            </FormField>
            <FormField label="Data"><FormInput type="date" value={formAndamento.data} onChange={e => setFormAndamento({...formAndamento, data: e.target.value})} /></FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalAndamento(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Registrar'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* ========================= MODAL PAGAMENTO ========================= */}
      <Modal aberto={modalPagamento} onFechar={() => setModalPagamento(false)} titulo="Novo Pagamento">
        <form onSubmit={salvarPagamento} className="space-y-4">
          <FormField label="Descrição" obrigatorio><FormInput value={formPagamento.descricao} onChange={e => setFormPagamento({...formPagamento, descricao: e.target.value})} required placeholder="Ex: Honorários advocatícios" /></FormField>
          <FormField label="Valor Total" obrigatorio><FormInput type="number" step="0.01" value={formPagamento.valorTotal} onChange={e => setFormPagamento({...formPagamento, valorTotal: e.target.value})} required placeholder="0.00" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Forma de Pagamento">
              <FormSelect value={formPagamento.formaPagamento} onChange={e => setFormPagamento({...formPagamento, formaPagamento: e.target.value})}>
                <option value="avista">À Vista</option><option value="parcelado">Parcelado</option>
                <option value="honorarios_fixo">Honorários Fixo</option><option value="honorarios_exito">Honorários Êxito</option>
              </FormSelect>
            </FormField>
            <FormField label="Nº Parcelas"><FormInput type="number" min="1" max="60" value={formPagamento.numParcelas} onChange={e => setFormPagamento({...formPagamento, numParcelas: e.target.value})} /></FormField>
          </div>
          {parseInt(formPagamento.numParcelas) > 1 && formPagamento.valorTotal && (
            <p className="text-sm text-[#c9a84c]">{formPagamento.numParcelas}x de {formatarMoeda(parseFloat(formPagamento.valorTotal) / parseInt(formPagamento.numParcelas))}</p>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalPagamento(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Registrar Pagamento'}</FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
