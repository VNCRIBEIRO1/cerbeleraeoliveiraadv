'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface Triagem {
  id: string; nome: string; telefone: string; area: string; subarea: string
  urgencia: string; detalhes: string; status: string; observacoes: string | null; criadoEm: string
}

export default function TriagemPage() {
  const [triagens, setTriagens] = useState<Triagem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('nova')
  const [modalConversao, setModalConversao] = useState<Triagem | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [formConversao, setFormConversao] = useState({ email: '', cpfCnpj: '', endereco: '', cidade: '', estado: 'SP', observacoes: '' })

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/triagem')
      setTriagens(await res.json())
    } finally { setLoading(false) }
  }

  const alterarStatus = async (id: string, status: string) => {
    await fetch(`/api/triagem/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    carregar()
  }

  const converterCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalConversao) return
    setSalvando(true)
    try {
      const res = await fetch(`/api/triagem/${modalConversao.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'convertida',
          converterCliente: true,
          dadosCliente: {
            nome: modalConversao.nome,
            telefone: modalConversao.telefone,
            email: formConversao.email,
            cpfCnpj: formConversao.cpfCnpj,
            endereco: formConversao.endereco,
            cidade: formConversao.cidade,
            estado: formConversao.estado,
            observacoes: formConversao.observacoes || `Origem: chatbot | Área: ${modalConversao.area} - ${modalConversao.subarea}`,
            origem: 'chatbot',
          }
        }),
      })
      if (res.ok) {
        setModalConversao(null)
        carregar()
      }
    } finally { setSalvando(false) }
  }

  const triagensFiltradas = filtro === 'todas' ? triagens : triagens.filter(t => t.status === filtro)

  const corUrgencia: Record<string, string> = {
    alta: 'text-red-400 bg-red-900/20',
    media: 'text-yellow-400 bg-yellow-900/20',
    baixa: 'text-green-400 bg-green-900/20',
  }

  const abrirConversao = (t: Triagem) => {
    setFormConversao({ email: '', cpfCnpj: '', endereco: '', cidade: '', estado: 'SP', observacoes: '' })
    setModalConversao(t)
  }

  const gerarWhatsApp = (t: Triagem) => {
    const numero = t.telefone.replace(/\D/g, '')
    const msg = `Prezado(a) ${t.nome},\n\nRecebemos sua solicitacao referente a ${t.area} - ${t.subarea}.\n\nGostarıamos de agendar uma consulta para analisar seu caso.\n\nPodemos prosseguir?\n\nCerbelera & Oliveira Advogados\nTel: (18) 99610-1884`
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const parseDetalhes = (d: string) => {
    try { return JSON.parse(d) } catch { return {} }
  }

  const quantidadePorStatus = (s: string) => triagens.filter(t => t.status === s).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Triagem do ChatBot</h1>
        <p className="text-[#6b8a6f] text-sm mt-1">
          {triagens.length} solicitação(ões) total • {quantidadePorStatus('nova')} nova(s)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Novas', v: quantidadePorStatus('nova'), cor: 'border-blue-600/30 bg-blue-900/10' },
          { label: 'Em Análise', v: quantidadePorStatus('em_analise'), cor: 'border-yellow-600/30 bg-yellow-900/10' },
          { label: 'Convertidas', v: quantidadePorStatus('convertida'), cor: 'border-green-600/30 bg-green-900/10' },
          { label: 'Descartadas', v: quantidadePorStatus('descartada'), cor: 'border-gray-600/30 bg-gray-900/10' },
        ].map(c => (
          <div key={c.label} className={`rounded-xl p-4 border ${c.cor}`}>
            <p className="text-xs text-[#8a9f8e]">{c.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{c.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'nova', label: 'Novas' }, { value: 'em_analise', label: 'Em Análise' },
          { value: 'convertida', label: 'Convertidas' }, { value: 'descartada', label: 'Descartadas' },
          { value: 'todas', label: 'Todas' },
        ].map(f => (
          <button key={f.value} onClick={() => setFiltro(f.value)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filtro === f.value ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'bg-[#0e1810] text-[#8a9f8e] border border-[#2a3f2e] hover:text-white'
            }`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
      ) : triagensFiltradas.length === 0 ? (
        <p className="text-center text-[#6b8a6f] py-12">Nenhuma triagem encontrada</p>
      ) : (
        <div className="space-y-3">
          {triagensFiltradas.map(t => {
            const det = parseDetalhes(t.detalhes)
            return (
              <div key={t.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">{t.nome}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${corUrgencia[t.urgencia] || 'text-gray-400 bg-gray-900/20'}`}>
                        {t.urgencia}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6b8a6f] mt-1">
                      <span>{t.telefone}</span><span>•</span>
                      <span>{t.area}</span><span>•</span>
                      <span>{t.subarea}</span><span>•</span>
                      <span>{new Date(t.criadoEm).toLocaleDateString('pt-BR')} {new Date(t.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {Object.keys(det).length > 0 && (
                      <div className="mt-2 p-2 bg-[#1a2e1f] rounded-lg">
                        {Object.entries(det).map(([k, v]) => (
                          <p key={k} className="text-xs text-[#b0c4b4]"><span className="text-[#6b8a6f]">{k}:</span> {String(v)}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {t.status === 'nova' && (
                      <>
                        <button onClick={() => alterarStatus(t.id, 'em_analise')}
                          className="px-3 py-1 text-xs bg-yellow-900/30 text-yellow-400 rounded-lg border border-yellow-700/30 hover:bg-yellow-900/50">Analisar</button>
                        <button onClick={() => gerarWhatsApp(t)}
                          className="px-3 py-1 text-xs bg-green-900/30 text-green-400 rounded-lg border border-green-700/30 hover:bg-green-900/50">WhatsApp</button>
                      </>
                    )}
                    {(t.status === 'nova' || t.status === 'em_analise') && (
                      <>
                        <button onClick={() => abrirConversao(t)}
                          className="px-3 py-1 text-xs bg-[#c9a84c]/20 text-[#c9a84c] rounded-lg border border-[#c9a84c]/30 hover:bg-[#c9a84c]/30">Converter</button>
                        <button onClick={() => alterarStatus(t.id, 'descartada')}
                          className="px-3 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-lg border border-gray-600/30 hover:bg-gray-800/80">Descartar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Conversion Modal */}
      {modalConversao && (
        <Modal aberto={true} onFechar={() => setModalConversao(null)} titulo={`Converter "${modalConversao.nome}" em Cliente`} tamanho="lg">
          <form onSubmit={converterCliente} className="space-y-4">
            <div className="p-3 bg-[#1a2e1f] rounded-lg text-xs text-[#b0c4b4]">
              <p><span className="text-[#6b8a6f]">Nome:</span> {modalConversao.nome}</p>
              <p><span className="text-[#6b8a6f]">Telefone:</span> {modalConversao.telefone}</p>
              <p><span className="text-[#6b8a6f]">Área:</span> {modalConversao.area} — {modalConversao.subarea}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="E-mail"><FormInput type="email" value={formConversao.email} onChange={e => setFormConversao({...formConversao, email: e.target.value})} /></FormField>
              <FormField label="CPF/CNPJ"><FormInput value={formConversao.cpfCnpj} onChange={e => setFormConversao({...formConversao, cpfCnpj: e.target.value})} /></FormField>
              <FormField label="Cidade"><FormInput value={formConversao.cidade} onChange={e => setFormConversao({...formConversao, cidade: e.target.value})} /></FormField>
              <FormField label="Estado">
                <FormSelect value={formConversao.estado} onChange={e => setFormConversao({...formConversao, estado: e.target.value})}>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf =>
                    <option key={uf} value={uf}>{uf}</option>)}
                </FormSelect>
              </FormField>
            </div>
            <FormField label="Endereço"><FormInput value={formConversao.endereco} onChange={e => setFormConversao({...formConversao, endereco: e.target.value})} /></FormField>
            <FormField label="Observações"><FormTextarea value={formConversao.observacoes} onChange={e => setFormConversao({...formConversao, observacoes: e.target.value})} rows={2} /></FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
              <FormButton variant="secondary" type="button" onClick={() => setModalConversao(null)}>Cancelar</FormButton>
              <FormButton type="submit" disabled={salvando}>{salvando ? 'Convertendo...' : 'Converter em Cliente'}</FormButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
