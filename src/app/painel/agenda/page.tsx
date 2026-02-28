'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface Agendamento {
  id: string; titulo: string; descricao: string | null; dataHora: string
  duracao: number; tipo: string; status: string; local: string | null
  observacoes: string | null
  cliente: { id: string; nome: string; telefone: string; whatsapp: string | null } | null
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [visualizacao, setVisualizacao] = useState<'lista' | 'calendario'>('lista')
  const [modalAberto, setModalAberto] = useState(false)
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({
    titulo: '', descricao: '', dataHora: '', duracao: '60', tipo: 'consulta', local: '', clienteId: '', observacoes: '',
  })

  useEffect(() => {
    setLoading(true)
    fetch(`/api/agenda?mes=${mesAtual}&ano=${anoAtual}`)
      .then(r => r.json())
      .then(setAgendamentos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [mesAtual, anoAtual])

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const navegarMes = (dir: number) => {
    let m = mesAtual + dir
    let a = anoAtual
    if (m > 12) { m = 1; a++ }
    if (m < 1) { m = 12; a-- }
    setMesAtual(m); setAnoAtual(a)
  }

  const abrirNovo = async () => {
    const res = await fetch('/api/clientes?limite=100')
    const data = await res.json()
    setClientes((data.clientes || []).map((c: { id: string; nome: string }) => ({ id: c.id, nome: c.nome })))
    setForm({ titulo: '', descricao: '', dataHora: '', duracao: '60', tipo: 'consulta', local: '', clienteId: '', observacoes: '' })
    setModalAberto(true)
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      const res = await fetch('/api/agenda', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setModalAberto(false)
        const data = await fetch(`/api/agenda?mes=${mesAtual}&ano=${anoAtual}`).then(r => r.json())
        setAgendamentos(data)
      }
    } finally { setSalvando(false) }
  }

  const alterarStatus = async (id: string, status: string) => {
    await fetch(`/api/agenda/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await fetch(`/api/agenda?mes=${mesAtual}&ano=${anoAtual}`).then(r => r.json())
    setAgendamentos(data)
  }

  const gerarWhatsAppConfirmacao = (ag: Agendamento) => {
    if (!ag.cliente) return
    const numero = (ag.cliente.whatsapp || ag.cliente.telefone).replace(/\D/g, '')
    const data = new Date(ag.dataHora)
    const dataStr = data.toLocaleDateString('pt-BR')
    const horaStr = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const msg = `Prezado(a) ${ag.cliente.nome},\n\nConfirmamos seu agendamento:\n\nData: ${dataStr}\nHorario: ${horaStr}\nTipo: ${ag.tipo}\n${ag.local ? `Local: ${ag.local}\n` : ''}\nCerbelera & Oliveira Advogados\nTel: (18) 99610-1884`
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // Agrupar por dia para visualização lista
  const agrupadoPorDia: Record<string, Agendamento[]> = {}
  agendamentos.forEach(ag => {
    const dia = new Date(ag.dataHora).toLocaleDateString('pt-BR')
    if (!agrupadoPorDia[dia]) agrupadoPorDia[dia] = []
    agrupadoPorDia[dia].push(ag)
  })

  // Gerar dias do calendário
  const gerarCalendario = () => {
    const primeiroDia = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDia = new Date(anoAtual, mesAtual, 0)
    const diasNoMes = ultimoDia.getDate()
    const diaInicioSemana = primeiroDia.getDay()
    const dias: (number | null)[] = []
    for (let i = 0; i < diaInicioSemana; i++) dias.push(null)
    for (let i = 1; i <= diasNoMes; i++) dias.push(i)
    return dias
  }

  const agendamentosNoDia = (dia: number) => {
    return agendamentos.filter(ag => {
      const d = new Date(ag.dataHora)
      return d.getDate() === dia && d.getMonth() === mesAtual - 1 && d.getFullYear() === anoAtual
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">{agendamentos.length} agendamento(s) no mês</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-[#0e1810] border border-[#2a3f2e] rounded-lg overflow-hidden">
            <button onClick={() => setVisualizacao('lista')}
              className={`px-3 py-2 text-xs ${visualizacao === 'lista' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>Lista</button>
            <button onClick={() => setVisualizacao('calendario')}
              className={`px-3 py-2 text-xs ${visualizacao === 'calendario' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>Calendário</button>
          </div>
          <button onClick={abrirNovo}
            className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-medium rounded-lg hover:from-[#d4b55a] hover:to-[#c9a84c]">+ Novo Agendamento</button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => navegarMes(-1)} className="p-2 rounded-lg text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-lg font-semibold text-white min-w-[200px] text-center">{meses[mesAtual - 1]} {anoAtual}</h2>
        <button onClick={() => navegarMes(1)} className="p-2 rounded-lg text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
      ) : visualizacao === 'calendario' ? (
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-[#8a9f8e] py-2">{d}</div>
            ))}
            {gerarCalendario().map((dia, i) => {
              const ags = dia ? agendamentosNoDia(dia) : []
              const isHoje = dia && new Date().getDate() === dia && new Date().getMonth() === mesAtual - 1 && new Date().getFullYear() === anoAtual
              return (
                <div key={i} className={`min-h-[80px] p-1 rounded-lg border ${
                  dia ? (isHoje ? 'border-[#c9a84c]/50 bg-[#c9a84c]/5' : 'border-[#2a3f2e]/50 hover:border-[#2a3f2e]') : 'border-transparent'
                }`}>
                  {dia && (
                    <>
                      <p className={`text-xs font-medium mb-1 ${isHoje ? 'text-[#c9a84c]' : 'text-[#8a9f8e]'}`}>{dia}</p>
                      {ags.slice(0, 3).map(ag => (
                        <div key={ag.id} className="text-[10px] px-1 py-0.5 mb-0.5 rounded bg-[#1a2e1f] text-[#b0c4b4] truncate">
                          {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {ag.titulo}
                        </div>
                      ))}
                      {ags.length > 3 && <p className="text-[10px] text-[#6b8a6f]">+{ags.length - 3}</p>}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(agrupadoPorDia).length === 0 ? (
            <p className="text-center text-[#6b8a6f] py-12">Nenhum agendamento neste mês</p>
          ) : (
            Object.entries(agrupadoPorDia).map(([dia, ags]) => (
              <div key={dia}>
                <h3 className="text-sm font-medium text-[#c9a84c] mb-2">{dia}</h3>
                <div className="space-y-2">
                  {ags.map(ag => (
                    <div key={ag.id} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{ag.titulo}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#6b8a6f]">
                            <span>{new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>{ag.duracao}min</span>
                            <span className="capitalize">{ag.tipo}</span>
                            {ag.local && <span>{ag.local}</span>}
                          </div>
                          {ag.cliente && <p className="text-xs text-[#8a9f8e] mt-1">{ag.cliente.nome}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={ag.status} />
                          {ag.cliente && (
                            <button onClick={() => gerarWhatsAppConfirmacao(ag)}
                              className="p-1.5 rounded-lg text-green-500 hover:bg-green-900/30" title="Confirmar via WhatsApp">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </button>
                          )}
                          <select value={ag.status} onChange={e => alterarStatus(ag.id, e.target.value)}
                            className="px-2 py-1 text-xs bg-[#1a2e1f] border border-[#2a3f2e] rounded text-white">
                            <option value="agendado">Agendado</option><option value="confirmado">Confirmado</option>
                            <option value="realizado">Realizado</option><option value="cancelado">Cancelado</option>
                            <option value="remarcado">Remarcado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo Agendamento" tamanho="lg">
        <form onSubmit={salvar} className="space-y-4">
          <FormField label="Título" obrigatorio><FormInput value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required placeholder="Consulta inicial" /></FormField>
          <FormField label="Cliente">
            <FormSelect value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})}>
              <option value="">Sem cliente vinculado</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </FormSelect>
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Data e Hora" obrigatorio><FormInput type="datetime-local" value={form.dataHora} onChange={e => setForm({...form, dataHora: e.target.value})} required /></FormField>
            <FormField label="Duração (min)"><FormInput type="number" value={form.duracao} onChange={e => setForm({...form, duracao: e.target.value})} /></FormField>
            <FormField label="Tipo">
              <FormSelect value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="consulta">Consulta</option><option value="reuniao">Reunião</option>
                <option value="audiencia">Audiência</option><option value="prazo">Prazo</option>
              </FormSelect>
            </FormField>
            <FormField label="Local"><FormInput value={form.local} onChange={e => setForm({...form, local: e.target.value})} placeholder="Escritório" /></FormField>
          </div>
          <FormField label="Descrição"><FormTextarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={2} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalAberto(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Agendar'}</FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
