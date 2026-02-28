'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface ProcessoDetalhes {
  id: string; numero: string | null; tipo: string; assunto: string; descricao: string | null
  status: string; vara: string | null; comarca: string | null; valorCausa: number | null
  dataDistribuicao: string | null; observacoes: string | null; criadoEm: string
  cliente: { id: string; nome: string; telefone: string }
  advogado: { id: string; nome: string } | null
  prazos: Array<{ id: string; titulo: string; descricao: string | null; dataLimite: string; tipo: string; status: string; prioridade: string }>
  andamentos: Array<{ id: string; descricao: string; data: string; tipo: string }>
  pagamentos: Array<{ id: string; descricao: string; valorTotal: number; status: string; parcelas: Array<{ id: string; numero: number; valor: number; dataVencimento: string; status: string }> }>
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
  const [salvando, setSalvando] = useState(false)

  const [formPrazo, setFormPrazo] = useState({ titulo: '', descricao: '', dataLimite: '', tipo: 'outro', prioridade: 'normal' })
  const [formAndamento, setFormAndamento] = useState({ descricao: '', tipo: 'outro', data: '' })

  const recarregar = () => fetch(`/api/processos/${id}`).then(r => r.json()).then(setProcesso)

  useEffect(() => {
    recarregar().finally(() => setLoading(false))
  }, [id])

  const formatarData = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
  const formatarMoeda = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const salvarPrazo = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      await fetch('/api/prazos', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formPrazo, processoId: id }) })
      setModalPrazo(false); recarregar()
    } finally { setSalvando(false) }
  }

  const salvarAndamento = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      await fetch(`/api/processos/${id}/andamentos`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formAndamento) })
      setModalAndamento(false); recarregar()
    } finally { setSalvando(false) }
  }

  const cumprirPrazo = async (prazoId: string) => {
    await fetch(`/api/prazos/${prazoId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cumprido' }) })
    recarregar()
  }

  const alterarStatus = async (novoStatus: string) => {
    await fetch(`/api/processos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }) })
    recarregar()
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-3 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
  if (!processo) return <p className="text-red-400 text-center py-12">Processo não encontrado</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/painel/processos')} className="text-[#c9a84c] hover:underline">Processos</button>
        <span className="text-[#6b8a6f]">/</span>
        <span className="text-[#b0c4b4]">{processo.numero || processo.assunto}</span>
      </div>

      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{processo.numero || 'Processo sem número'}</h1>
              <StatusBadge status={processo.status} />
            </div>
            <p className="text-sm text-[#d0dcd2] mb-2">{processo.assunto}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <p className="text-[#8a9f8e]">Cliente: <button onClick={() => router.push(`/painel/clientes/${processo.cliente.id}`)} className="text-[#c9a84c] hover:underline">{processo.cliente.nome}</button></p>
              <p className="text-[#8a9f8e]">Tipo: <span className="text-[#d0dcd2] capitalize">{processo.tipo}</span></p>
              <p className="text-[#8a9f8e]">Vara: <span className="text-[#d0dcd2]">{processo.vara || '-'}</span></p>
              <p className="text-[#8a9f8e]">Comarca: <span className="text-[#d0dcd2]">{processo.comarca || '-'}</span></p>
              <p className="text-[#8a9f8e]">Valor: <span className="text-[#d0dcd2]">{processo.valorCausa ? formatarMoeda(processo.valorCausa) : '-'}</span></p>
              <p className="text-[#8a9f8e]">Desde: <span className="text-[#d0dcd2]">{formatarData(processo.criadoEm)}</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <FormSelect value={processo.status} onChange={e => alterarStatus(e.target.value)} className="!w-auto">
              <option value="em_andamento">Em Andamento</option><option value="concluido">Concluído</option>
              <option value="suspenso">Suspenso</option><option value="arquivado">Arquivado</option>
            </FormSelect>
          </div>
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
                    <p className="text-sm text-white">{and.descricao}</p>
                    <span className="text-xs text-[#6b8a6f] flex-shrink-0">{formatarData(and.data)}</span>
                  </div>
                  <p className="text-xs text-[#8a9f8e] mt-1 capitalize">{and.tipo}</p>
                </div>
              </div>
            ))}
            {processo.andamentos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum andamento registrado</p>}
          </div>
        </div>
      )}

      {abaAtiva === 'prazos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => { setFormPrazo({ titulo: '', descricao: '', dataLimite: '', tipo: 'outro', prioridade: 'normal' }); setModalPrazo(true) }}>+ Novo Prazo</FormButton>
          </div>
          <div className="space-y-3">
            {processo.prazos.map(p => (
              <div key={p.id} className={`bg-[#0e1810] border rounded-xl p-4 ${p.status === 'pendente' && new Date(p.dataLimite) < new Date() ? 'border-red-800/50' : 'border-[#2a3f2e]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{p.titulo}</p>
                    {p.descricao && <p className="text-xs text-[#6b8a6f] mt-1">{p.descricao}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={p.prioridade} />
                      <span className="text-xs text-[#8a9f8e] capitalize">{p.tipo}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-[#c9a84c]">{formatarData(p.dataLimite)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={p.status} />
                      {p.status === 'pendente' && (
                        <button onClick={() => cumprirPrazo(p.id)}
                          className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/50">Cumprido</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {processo.prazos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum prazo</p>}
          </div>
        </div>
      )}

      {abaAtiva === 'financeiro' && (
        <div className="space-y-4">
          {processo.pagamentos.map(pag => (
            <div key={pag.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white">{pag.descricao}</p>
                  <p className="text-xs text-[#6b8a6f]">{formatarMoeda(pag.valorTotal)}</p>
                </div>
                <StatusBadge status={pag.status} />
              </div>
              {pag.parcelas.map(parc => (
                <div key={parc.id} className="flex items-center justify-between px-3 py-2 bg-[#1a2e1f] rounded-lg mb-1">
                  <span className="text-sm text-white">#{parc.numero} - {formatarMoeda(parc.valor)} - Venc: {formatarData(parc.dataVencimento)}</span>
                  <StatusBadge status={parc.status === 'pendente' && new Date(parc.dataVencimento) < new Date() ? 'atrasado' : parc.status} />
                </div>
              ))}
            </div>
          ))}
          {processo.pagamentos.length === 0 && <p className="text-center text-[#6b8a6f] py-8">Nenhum pagamento vinculado</p>}
        </div>
      )}

      {/* Modal Prazo */}
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

      {/* Modal Andamento */}
      <Modal aberto={modalAndamento} onFechar={() => setModalAndamento(false)} titulo="Novo Andamento">
        <form onSubmit={salvarAndamento} className="space-y-4">
          <FormField label="Descrição" obrigatorio><FormTextarea value={formAndamento.descricao} onChange={e => setFormAndamento({...formAndamento, descricao: e.target.value})} required rows={4} placeholder="Descreva o andamento processual" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <FormSelect value={formAndamento.tipo} onChange={e => setFormAndamento({...formAndamento, tipo: e.target.value})}>
                <option value="despacho">Despacho</option><option value="sentenca">Sentença</option>
                <option value="peticao">Petição</option><option value="audiencia">Audiência</option>
                <option value="diligencia">Diligência</option><option value="outro">Outro</option>
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
    </div>
  )
}
