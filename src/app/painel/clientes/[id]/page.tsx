'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface ClienteDetalhes {
  id: string; nome: string; cpfCnpj: string | null; email: string | null
  telefone: string; whatsapp: string | null; endereco: string | null
  cidade: string | null; estado: string | null; cep: string | null
  observacoes: string | null; origem: string; status: string; criadoEm: string
  advogado: { id: string; nome: string } | null
  processos: Array<{ id: string; numero: string | null; tipo: string; assunto: string; status: string; criadoEm: string; _count: { prazos: number; andamentos: number } }>
  agendamentos: Array<{ id: string; titulo: string; dataHora: string; tipo: string; status: string }>
  pagamentos: Array<{ id: string; descricao: string; valorTotal: number; status: string; parcelas: Array<{ id: string; numero: number; valor: number; dataVencimento: string; dataPagamento: string | null; status: string }> }>
  documentos: Array<{ id: string; nome: string; tipo: string; criadoEm: string }>
}

export default function ClienteDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('processos')
  const [modalProcesso, setModalProcesso] = useState(false)
  const [modalAgendamento, setModalAgendamento] = useState(false)
  const [modalPagamento, setModalPagamento] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const [formProcesso, setFormProcesso] = useState({
    numero: '', tipo: 'trabalhista', assunto: '', descricao: '', vara: '', comarca: '', valorCausa: '',
  })

  const [formAgendamento, setFormAgendamento] = useState({
    titulo: '', descricao: '', dataHora: '', duracao: '60', tipo: 'consulta', local: '',
  })

  const [formPagamento, setFormPagamento] = useState({
    descricao: '', valorTotal: '', formaPagamento: 'avista', numParcelas: '1',
  })

  useEffect(() => {
    fetch(`/api/clientes/${id}`)
      .then(r => r.json())
      .then(setCliente)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const formatarData = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
  const formatarMoeda = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const salvarProcesso = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/processos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formProcesso, clienteId: id }),
      })
      if (res.ok) {
        setModalProcesso(false)
        setFormProcesso({ numero: '', tipo: 'trabalhista', assunto: '', descricao: '', vara: '', comarca: '', valorCausa: '' })
        // Recarregar
        const data = await fetch(`/api/clientes/${id}`).then(r => r.json())
        setCliente(data)
      }
    } finally { setSalvando(false) }
  }

  const salvarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/agenda', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formAgendamento, clienteId: id }),
      })
      if (res.ok) {
        setModalAgendamento(false)
        const data = await fetch(`/api/clientes/${id}`).then(r => r.json())
        setCliente(data)
      }
    } finally { setSalvando(false) }
  }

  const salvarPagamento = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      const numP = parseInt(formPagamento.numParcelas)
      const valorP = parseFloat(formPagamento.valorTotal) / numP
      const parcelas = Array.from({ length: numP }, (_, i) => {
        const venc = new Date()
        venc.setMonth(venc.getMonth() + i + 1)
        return { numero: i + 1, valor: valorP.toFixed(2), dataVencimento: venc.toISOString() }
      })

      const res = await fetch('/api/financeiro', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao: formPagamento.descricao,
          valorTotal: formPagamento.valorTotal,
          formaPagamento: formPagamento.formaPagamento,
          clienteId: id,
          parcelas,
        }),
      })
      if (res.ok) {
        setModalPagamento(false)
        const data = await fetch(`/api/clientes/${id}`).then(r => r.json())
        setCliente(data)
      }
    } finally { setSalvando(false) }
  }

  const pagarParcela = async (pagamentoId: string, parcelaId: string) => {
    await fetch(`/api/financeiro/${pagamentoId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelaId, parcelaStatus: 'pago' }),
    })
    const data = await fetch(`/api/clientes/${id}`).then(r => r.json())
    setCliente(data)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-3 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
  if (!cliente) return <p className="text-red-400 text-center py-12">Cliente não encontrado</p>

  const abas = [
    { key: 'processos', label: 'Processos', count: cliente.processos.length },
    { key: 'agendamentos', label: 'Agendamentos', count: cliente.agendamentos.length },
    { key: 'financeiro', label: 'Financeiro', count: cliente.pagamentos.length },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/painel/clientes')} className="text-[#c9a84c] hover:underline">Clientes</button>
        <span className="text-[#6b8a6f]">/</span>
        <span className="text-[#b0c4b4]">{cliente.nome}</span>
      </div>

      {/* Client Info Card */}
      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{cliente.nome}</h1>
              <StatusBadge status={cliente.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <p className="text-[#8a9f8e]">CPF/CNPJ: <span className="text-[#d0dcd2]">{cliente.cpfCnpj || '-'}</span></p>
              <p className="text-[#8a9f8e]">Telefone: <span className="text-[#d0dcd2]">{cliente.telefone}</span></p>
              <p className="text-[#8a9f8e]">Email: <span className="text-[#d0dcd2]">{cliente.email || '-'}</span></p>
              <p className="text-[#8a9f8e]">Endereço: <span className="text-[#d0dcd2]">{cliente.endereco ? `${cliente.endereco}, ${cliente.cidade}/${cliente.estado}` : '-'}</span></p>
              <p className="text-[#8a9f8e]">Origem: <span className="text-[#d0dcd2]">{cliente.origem}</span></p>
              <p className="text-[#8a9f8e]">Desde: <span className="text-[#d0dcd2]">{formatarData(cliente.criadoEm)}</span></p>
            </div>
            {cliente.observacoes && <p className="text-sm text-[#6b8a6f] mt-3 italic">{cliente.observacoes}</p>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => { const n = (cliente.whatsapp || cliente.telefone).replace(/\D/g, ''); window.open(`https://wa.me/55${n}`, '_blank') }}
              className="p-2 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors" title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-1">
        {abas.map(aba => (
          <button
            key={aba.key}
            onClick={() => setAbaAtiva(aba.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              abaAtiva === aba.key ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]'
            }`}
          >
            {aba.label} ({aba.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {abaAtiva === 'processos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => setModalProcesso(true)}>+ Novo Processo</FormButton>
          </div>
          {cliente.processos.length === 0 ? (
            <p className="text-center text-[#6b8a6f] py-8">Nenhum processo vinculado</p>
          ) : (
            <div className="space-y-3">
              {cliente.processos.map(p => (
                <div key={p.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/painel/processos/${p.id}`)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{p.numero || 'Sem número'} - {p.assunto}</p>
                      <p className="text-xs text-[#6b8a6f] mt-1">Tipo: {p.tipo} | {p._count.prazos} prazos | {p._count.andamentos} andamentos</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {abaAtiva === 'agendamentos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => setModalAgendamento(true)}>+ Novo Agendamento</FormButton>
          </div>
          {cliente.agendamentos.length === 0 ? (
            <p className="text-center text-[#6b8a6f] py-8">Nenhum agendamento</p>
          ) : (
            <div className="space-y-3">
              {cliente.agendamentos.map(a => (
                <div key={a.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{a.titulo}</p>
                      <p className="text-xs text-[#6b8a6f] mt-1">{new Date(a.dataHora).toLocaleString('pt-BR')} | {a.tipo}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {abaAtiva === 'financeiro' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <FormButton onClick={() => setModalPagamento(true)}>+ Novo Pagamento</FormButton>
          </div>
          {cliente.pagamentos.length === 0 ? (
            <p className="text-center text-[#6b8a6f] py-8">Nenhum pagamento registrado</p>
          ) : (
            <div className="space-y-4">
              {cliente.pagamentos.map(pag => (
                <div key={pag.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white">{pag.descricao}</p>
                      <p className="text-xs text-[#6b8a6f]">Total: {formatarMoeda(pag.valorTotal)}</p>
                    </div>
                    <StatusBadge status={pag.status} />
                  </div>
                  {pag.parcelas.length > 0 && (
                    <div className="space-y-2">
                      {pag.parcelas.map(parc => (
                        <div key={parc.id} className="flex items-center justify-between px-3 py-2 bg-[#1a2e1f] rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#8a9f8e]">#{parc.numero}</span>
                            <span className="text-sm text-white">{formatarMoeda(parc.valor)}</span>
                            <span className="text-xs text-[#6b8a6f]">Venc: {formatarData(parc.dataVencimento)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={parc.status === 'pendente' && new Date(parc.dataVencimento) < new Date() ? 'atrasado' : parc.status} />
                            {parc.status === 'pendente' && (
                              <button onClick={() => pagarParcela(pag.id, parc.id)}
                                className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/50 transition-colors">
                                Pagar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Novo Processo */}
      <Modal aberto={modalProcesso} onFechar={() => setModalProcesso(false)} titulo="Novo Processo" tamanho="lg">
        <form onSubmit={salvarProcesso} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Número do Processo"><FormInput value={formProcesso.numero} onChange={e => setFormProcesso({...formProcesso, numero: e.target.value})} placeholder="0000000-00.0000.0.00.0000" /></FormField>
            <FormField label="Área" obrigatorio>
              <FormSelect value={formProcesso.tipo} onChange={e => setFormProcesso({...formProcesso, tipo: e.target.value})}>
                <option value="trabalhista">Trabalhista</option><option value="criminal">Criminal</option>
                <option value="civil">Civil</option><option value="empresarial">Empresarial</option>
                <option value="administrativo">Administrativo</option><option value="previdenciario">Previdenciário</option>
              </FormSelect>
            </FormField>
            <FormField label="Assunto" obrigatorio><FormInput value={formProcesso.assunto} onChange={e => setFormProcesso({...formProcesso, assunto: e.target.value})} required placeholder="Assunto do processo" /></FormField>
            <FormField label="Valor da Causa"><FormInput type="number" step="0.01" value={formProcesso.valorCausa} onChange={e => setFormProcesso({...formProcesso, valorCausa: e.target.value})} placeholder="0.00" /></FormField>
            <FormField label="Vara"><FormInput value={formProcesso.vara} onChange={e => setFormProcesso({...formProcesso, vara: e.target.value})} placeholder="1ª Vara do Trabalho" /></FormField>
            <FormField label="Comarca"><FormInput value={formProcesso.comarca} onChange={e => setFormProcesso({...formProcesso, comarca: e.target.value})} placeholder="Birigui/SP" /></FormField>
          </div>
          <FormField label="Descrição"><FormTextarea value={formProcesso.descricao} onChange={e => setFormProcesso({...formProcesso, descricao: e.target.value})} rows={3} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalProcesso(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Criar Processo'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* Modal Novo Agendamento */}
      <Modal aberto={modalAgendamento} onFechar={() => setModalAgendamento(false)} titulo="Novo Agendamento">
        <form onSubmit={salvarAgendamento} className="space-y-4">
          <FormField label="Título" obrigatorio><FormInput value={formAgendamento.titulo} onChange={e => setFormAgendamento({...formAgendamento, titulo: e.target.value})} required placeholder="Consulta inicial" /></FormField>
          <FormField label="Data e Hora" obrigatorio><FormInput type="datetime-local" value={formAgendamento.dataHora} onChange={e => setFormAgendamento({...formAgendamento, dataHora: e.target.value})} required /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duração (min)"><FormInput type="number" value={formAgendamento.duracao} onChange={e => setFormAgendamento({...formAgendamento, duracao: e.target.value})} /></FormField>
            <FormField label="Tipo">
              <FormSelect value={formAgendamento.tipo} onChange={e => setFormAgendamento({...formAgendamento, tipo: e.target.value})}>
                <option value="consulta">Consulta</option><option value="reuniao">Reunião</option>
                <option value="audiencia">Audiência</option><option value="prazo">Prazo</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Local"><FormInput value={formAgendamento.local} onChange={e => setFormAgendamento({...formAgendamento, local: e.target.value})} placeholder="Escritório / Online" /></FormField>
          <FormField label="Descrição"><FormTextarea value={formAgendamento.descricao} onChange={e => setFormAgendamento({...formAgendamento, descricao: e.target.value})} rows={2} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalAgendamento(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Agendar'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* Modal Novo Pagamento */}
      <Modal aberto={modalPagamento} onFechar={() => setModalPagamento(false)} titulo="Novo Pagamento">
        <form onSubmit={salvarPagamento} className="space-y-4">
          <FormField label="Descrição" obrigatorio><FormInput value={formPagamento.descricao} onChange={e => setFormPagamento({...formPagamento, descricao: e.target.value})} required placeholder="Honorários advocatícios" /></FormField>
          <FormField label="Valor Total" obrigatorio><FormInput type="number" step="0.01" value={formPagamento.valorTotal} onChange={e => setFormPagamento({...formPagamento, valorTotal: e.target.value})} required placeholder="0.00" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Forma de Pagamento">
              <FormSelect value={formPagamento.formaPagamento} onChange={e => setFormPagamento({...formPagamento, formaPagamento: e.target.value})}>
                <option value="avista">À Vista</option><option value="parcelado">Parcelado</option><option value="honorarios">Honorários</option>
              </FormSelect>
            </FormField>
            <FormField label="Nº de Parcelas"><FormInput type="number" min="1" max="60" value={formPagamento.numParcelas} onChange={e => setFormPagamento({...formPagamento, numParcelas: e.target.value})} /></FormField>
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
