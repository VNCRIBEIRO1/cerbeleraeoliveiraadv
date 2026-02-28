'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface Cliente {
  id: string
  nome: string
  cpfCnpj: string | null
  email: string | null
  telefone: string
  whatsapp: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  observacoes: string | null
  origem: string
  status: string
  criadoEm: string
  advogado: { id: string; nome: string } | null
  _count: { processos: number; agendamentos: number; pagamentos: number }
}

const clienteVazio = {
  nome: '', cpfCnpj: '', email: '', telefone: '', whatsapp: '',
  endereco: '', cidade: '', estado: '', cep: '', observacoes: '',
  origem: 'manual', status: 'ativo', advogadoId: '',
}

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [pagina, setPagina] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(clienteVazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pagina: String(pagina), busca, status: filtroStatus })
      const res = await fetch(`/api/clientes?${params}`)
      const data = await res.json()
      setClientes(data.clientes || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }, [pagina, busca, filtroStatus])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setForm(clienteVazio)
    setEditandoId(null)
    setModalAberto(true)
  }

  const abrirEditar = (c: Cliente) => {
    setForm({
      nome: c.nome,
      cpfCnpj: c.cpfCnpj || '',
      email: c.email || '',
      telefone: c.telefone,
      whatsapp: c.whatsapp || '',
      endereco: c.endereco || '',
      cidade: c.cidade || '',
      estado: c.estado || '',
      cep: c.cep || '',
      observacoes: c.observacoes || '',
      origem: c.origem,
      status: c.status,
      advogadoId: c.advogado?.id || '',
    })
    setEditandoId(c.id)
    setModalAberto(true)
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      const url = editandoId ? `/api/clientes/${editandoId}` : '/api/clientes'
      const method = editandoId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setModalAberto(false)
        carregar()
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir o cliente "${nome}"?`)) return
    try {
      await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      carregar()
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const gerarWhatsApp = (telefone: string, nome: string) => {
    const numero = telefone.replace(/\D/g, '')
    const msg = encodeURIComponent(`Olá ${nome}, aqui é da Cerbelera & Oliveira Advogados. `)
    window.open(`https://wa.me/55${numero}?text=${msg}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">{total} cliente(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.open('/api/exportar?tipo=clientes&formato=csv', '_blank')}
            className="px-3 py-2 bg-[#1a2e1f] border border-[#2a3f2e] text-[#b0c4b4] text-sm rounded-lg hover:bg-[#2a3f2e] transition-colors"
          >
            Exportar CSV
          </button>
          <button
            onClick={abrirNovo}
            className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-medium rounded-lg hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all"
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, email ou telefone..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1) }}
          className="px-3 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="prospecto">Prospecto</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a3f2e]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden md:table-cell">Telefone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase hidden md:table-cell">Processos</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6b8a6f]">
                  <div className="w-5 h-5 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : clientes.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6b8a6f]">Nenhum cliente encontrado</td></tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id} className="border-b border-[#2a3f2e]/50 hover:bg-[#1a2e1f]/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => router.push(`/painel/clientes/${c.id}`)} className="text-left">
                        <p className="text-sm font-medium text-white hover:text-[#c9a84c] transition-colors">{c.nome}</p>
                        <p className="text-xs text-[#6b8a6f]">{c.cpfCnpj || 'CPF não informado'}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#d0dcd2] hidden md:table-cell">{c.telefone}</td>
                    <td className="px-4 py-3 text-sm text-[#d0dcd2] hidden lg:table-cell">{c.email || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-[#d0dcd2] hidden md:table-cell">{c._count.processos}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => gerarWhatsApp(c.whatsapp || c.telefone, c.nome)}
                          className="p-1.5 rounded-lg text-green-500 hover:bg-green-900/30 transition-colors"
                          title="WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>
                        <button
                          onClick={() => router.push(`/painel/clientes/${c.id}`)}
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-900/30 transition-colors"
                          title="Ver detalhes"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button
                          onClick={() => abrirEditar(c)}
                          className="p-1.5 rounded-lg text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => excluir(c.id, c.nome)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a3f2e]">
            <p className="text-xs text-[#6b8a6f]">{total} registro(s)</p>
            <div className="flex gap-2">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                className="px-3 py-1 text-xs rounded-lg bg-[#1a2e1f] text-[#b0c4b4] disabled:opacity-40 hover:bg-[#2a3f2e]">Anterior</button>
              <span className="px-3 py-1 text-xs text-[#8a9f8e]">Página {pagina}</span>
              <button onClick={() => setPagina(p => p + 1)} disabled={clientes.length < 20}
                className="px-3 py-1 text-xs rounded-lg bg-[#1a2e1f] text-[#b0c4b4] disabled:opacity-40 hover:bg-[#2a3f2e]">Próxima</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo/Editar Cliente */}
      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo={editandoId ? 'Editar Cliente' : 'Novo Cliente'} tamanho="lg">
        <form onSubmit={salvar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nome Completo" obrigatorio>
              <FormInput value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required placeholder="Nome do cliente" />
            </FormField>
            <FormField label="CPF/CNPJ">
              <FormInput value={form.cpfCnpj} onChange={(e) => setForm({...form, cpfCnpj: e.target.value})} placeholder="000.000.000-00" />
            </FormField>
            <FormField label="Telefone" obrigatorio>
              <FormInput value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} required placeholder="(00) 00000-0000" />
            </FormField>
            <FormField label="WhatsApp">
              <FormInput value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} placeholder="(00) 00000-0000" />
            </FormField>
            <FormField label="Email">
              <FormInput type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@exemplo.com" />
            </FormField>
            <FormField label="CEP">
              <FormInput value={form.cep} onChange={(e) => setForm({...form, cep: e.target.value})} placeholder="00000-000" />
            </FormField>
            <FormField label="Endereço">
              <FormInput value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} placeholder="Rua, número" />
            </FormField>
            <FormField label="Cidade">
              <FormInput value={form.cidade} onChange={(e) => setForm({...form, cidade: e.target.value})} placeholder="Cidade" />
            </FormField>
            <FormField label="Estado">
              <FormSelect value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}>
                <option value="">Selecione</option>
                {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </FormSelect>
            </FormField>
            <FormField label="Status">
              <FormSelect value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="prospecto">Prospecto</option>
              </FormSelect>
            </FormField>
            <FormField label="Origem">
              <FormSelect value={form.origem} onChange={(e) => setForm({...form, origem: e.target.value})}>
                <option value="manual">Cadastro Manual</option>
                <option value="chatbot">Chatbot</option>
                <option value="indicacao">Indicação</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Observações">
            <FormTextarea value={form.observacoes} onChange={(e) => setForm({...form, observacoes: e.target.value})} rows={3} placeholder="Observações sobre o cliente" />
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalAberto(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar'}</FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
