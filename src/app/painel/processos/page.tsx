'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface Processo {
  id: string; numero: string | null; tipo: string; assunto: string; status: string
  vara: string | null; comarca: string | null; valorCausa: number | null; criadoEm: string
  cliente: { id: string; nome: string }
  advogado: { id: string; nome: string } | null
  _count: { prazos: number; andamentos: number; documentos: number; pagamentos: number }
}

export default function ProcessosPage() {
  const router = useRouter()
  const [processos, setProcessos] = useState<Processo[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [pagina, setPagina] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({
    numero: '', tipo: 'trabalhista', assunto: '', descricao: '', vara: '', comarca: '', valorCausa: '', clienteId: '',
  })

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pagina: String(pagina), busca, status: filtroStatus })
      const res = await fetch(`/api/processos?${params}`)
      const data = await res.json()
      setProcessos(data.processos || [])
      setTotal(data.total || 0)
    } finally { setLoading(false) }
  }, [pagina, busca, filtroStatus])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = async () => {
    // Carregar clientes para o select
    const res = await fetch('/api/clientes?limite=100')
    const data = await res.json()
    setClientes((data.clientes || []).map((c: { id: string; nome: string }) => ({ id: c.id, nome: c.nome })))
    setForm({ numero: '', tipo: 'trabalhista', assunto: '', descricao: '', vara: '', comarca: '', valorCausa: '', clienteId: '' })
    setModalAberto(true)
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/processos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setModalAberto(false); carregar() }
    } finally { setSalvando(false) }
  }

  const formatarMoeda = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Processos</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">{total} processo(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.open('/api/exportar?tipo=processos&formato=csv', '_blank')}
            className="px-3 py-2 bg-[#1a2e1f] border border-[#2a3f2e] text-[#b0c4b4] text-sm rounded-lg hover:bg-[#2a3f2e]">Exportar CSV</button>
          <button onClick={abrirNovo}
            className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-medium rounded-lg hover:from-[#d4b55a] hover:to-[#c9a84c]">+ Novo Processo</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Buscar por número, assunto..." value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50" />
        </div>
        <select value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1) }}
          className="px-3 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a84c]/50">
          <option value="">Todos</option><option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option><option value="suspenso">Suspenso</option><option value="arquivado">Arquivado</option>
        </select>
      </div>

      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a3f2e]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Processo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden md:table-cell">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden lg:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden lg:table-cell">Valor</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6b8a6f]"><div className="w-5 h-5 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : processos.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6b8a6f]">Nenhum processo encontrado</td></tr>
              ) : processos.map(p => (
                <tr key={p.id} className="border-b border-[#2a3f2e]/50 hover:bg-[#1a2e1f]/50 transition-colors">
                  <td className="px-4 py-3 cursor-pointer" onClick={() => router.push(`/painel/processos/${p.id}`)}>
                    <p className="text-sm font-medium text-white hover:text-[#c9a84c]">{p.numero || 'Sem número'}</p>
                    <p className="text-xs text-[#6b8a6f]">{p.assunto}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/painel/clientes/${p.cliente.id}`) }}
                      className="text-sm text-[#c9a84c] hover:underline">{p.cliente.nome}</button>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#d0dcd2] hidden lg:table-cell capitalize">{p.tipo}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-sm text-[#d0dcd2] hidden lg:table-cell">{p.valorCausa ? formatarMoeda(p.valorCausa) : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-[#6b8a6f] mr-2">{p._count.prazos}P | {p._count.andamentos}A</span>
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/painel/processos/${p.id}`) }}
                        className="p-1.5 text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg" title="Detalhes">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm(`Excluir "${p.numero || p.assunto}"?\nEsta ação não pode ser desfeita.`)) return
                          const res = await fetch(`/api/processos/${p.id}`, { method: 'DELETE' })
                          if (res.ok) carregar()
                        }}
                        className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-900/20 rounded-lg" title="Excluir">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo Processo" tamanho="lg">
        <form onSubmit={salvar} className="space-y-4">
          <FormField label="Cliente" obrigatorio>
            <FormSelect value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} required>
              <option value="">Selecione o cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </FormSelect>
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Número do Processo"><FormInput value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} placeholder="0000000-00.0000.0.00.0000" /></FormField>
            <FormField label="Área" obrigatorio>
              <FormSelect value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="trabalhista">Trabalhista</option><option value="criminal">Criminal</option>
                <option value="civil">Civil</option><option value="empresarial">Empresarial</option>
                <option value="administrativo">Administrativo</option><option value="previdenciario">Previdenciário</option>
              </FormSelect>
            </FormField>
            <FormField label="Assunto" obrigatorio><FormInput value={form.assunto} onChange={e => setForm({...form, assunto: e.target.value})} required /></FormField>
            <FormField label="Valor da Causa"><FormInput type="number" step="0.01" value={form.valorCausa} onChange={e => setForm({...form, valorCausa: e.target.value})} /></FormField>
            <FormField label="Vara"><FormInput value={form.vara} onChange={e => setForm({...form, vara: e.target.value})} /></FormField>
            <FormField label="Comarca"><FormInput value={form.comarca} onChange={e => setForm({...form, comarca: e.target.value})} /></FormField>
          </div>
          <FormField label="Descrição"><FormTextarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={3} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalAberto(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Criar Processo'}</FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
