'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/painel/StatusBadge'
import Modal, { FormField, FormInput, FormSelect, FormTextarea, FormButton } from '@/components/painel/Modal'

interface Agendamento {
  id: string; titulo: string; descricao: string | null; dataHora: string
  duracao: number; tipo: string; status: string; local: string | null
  googleEventId: string | null; observacoes: string | null; criadoEm: string
  cliente: { id: string; nome: string; telefone: string; whatsapp: string | null } | null
}

interface Bloqueio {
  id: string; tipo: string; dataInicio: string; dataFim: string | null
  horaInicio: string | null; horaFim: string | null; motivo: string | null
  recorrente: boolean; diaSemana: number | null; ativo: boolean; criadoEm: string
}

const STATUS_OPTIONS = [
  { value: 'pendente', label: '⏳ Pendente' },
  { value: 'agendado', label: '📅 Agendado' },
  { value: 'confirmado', label: '✅ Confirmado' },
  { value: 'realizado', label: '🏁 Realizado' },
  { value: 'cancelado', label: '❌ Cancelado' },
  { value: 'remarcado', label: '🔄 Remarcado' },
]

const TIPO_OPTIONS = [
  { value: 'consulta', label: 'Consulta' },
  { value: 'reuniao', label: 'Reunião' },
  { value: 'audiencia', label: 'Audiência' },
  { value: 'prazo', label: 'Prazo' },
  { value: 'retorno', label: 'Retorno' },
]

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function AgendaPage() {
  const [tab, setTab] = useState<'agendamentos' | 'disponibilidade'>('agendamentos')
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([])
  const [loading, setLoading] = useState(true)
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [visualizacao, setVisualizacao] = useState<'lista' | 'calendario'>('lista')
  const [filtroStatus, setFiltroStatus] = useState<string>('')

  // Modais agendamento
  const [modalNovo, setModalNovo] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalDetalhe, setModalDetalhe] = useState(false)
  const [modalDeletar, setModalDeletar] = useState(false)
  const [agSelecionado, setAgSelecionado] = useState<Agendamento | null>(null)

  // Modal bloqueio
  const [modalBloqueio, setModalBloqueio] = useState(false)
  const [modalDeletarBloqueio, setModalDeletarBloqueio] = useState(false)
  const [bloqueioSelecionado, setBloqueioSelecionado] = useState<Bloqueio | null>(null)

  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])
  const [salvando, setSalvando] = useState(false)
  const [googleConectado, setGoogleConectado] = useState(false)
  const [sincronizando, setSincronizando] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  const [form, setForm] = useState({
    titulo: '', descricao: '', dataHora: '', duracao: '60', tipo: 'consulta',
    local: '', clienteId: '', observacoes: '', status: 'agendado',
  })

  const [formBloqueio, setFormBloqueio] = useState({
    tipo: 'dia_inteiro', dataInicio: '', dataFim: '', horaInicio: '', horaFim: '',
    motivo: '', recorrente: false, diaSemana: '',
  })

  // ---- CARREGAR ----
  const carregarAgendamentos = async () => {
    setLoading(true)
    try {
      let url = `/api/agenda?mes=${mesAtual}&ano=${anoAtual}`
      if (filtroStatus) url += `&status=${filtroStatus}`
      const res = await fetch(url)
      if (res.ok) setAgendamentos(await res.json())
    } catch { /* */ }
    setLoading(false)
  }

  const carregarBloqueios = async () => {
    try {
      const res = await fetch('/api/bloqueios')
      if (res.ok) setBloqueios(await res.json())
    } catch { /* */ }
  }

  useEffect(() => { carregarAgendamentos() }, [mesAtual, anoAtual, filtroStatus])
  useEffect(() => { carregarBloqueios() }, [])
  useEffect(() => {
    fetch('/api/google/sync').then(r => r.json()).then(d => setGoogleConectado(!!d.conectado)).catch(() => {})
  }, [])

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const navegarMes = (dir: number) => {
    let m = mesAtual + dir, a = anoAtual
    if (m > 12) { m = 1; a++ } if (m < 1) { m = 12; a-- }
    setMesAtual(m); setAnoAtual(a)
  }

  const carregarClientes = async () => {
    const res = await fetch('/api/clientes?limite=200')
    const data = await res.json()
    setClientes((data.clientes || []).map((c: { id: string; nome: string }) => ({ id: c.id, nome: c.nome })))
  }

  // ---- AGENDAMENTO CRUD ----
  const abrirNovo = async () => {
    await carregarClientes()
    setForm({ titulo: '', descricao: '', dataHora: '', duracao: '60', tipo: 'consulta', local: '', clienteId: '', observacoes: '', status: 'agendado' })
    setModalNovo(true)
  }

  const salvarNovo = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      const res = await fetch('/api/agenda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setModalNovo(false); await carregarAgendamentos() }
    } finally { setSalvando(false) }
  }

  const abrirEditar = async (ag: Agendamento) => {
    await carregarClientes()
    const dt = new Date(ag.dataHora)
    const dataLocal = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}T${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`
    setForm({ titulo: ag.titulo, descricao: ag.descricao || '', dataHora: dataLocal, duracao: String(ag.duracao), tipo: ag.tipo, local: ag.local || '', clienteId: ag.cliente?.id || '', observacoes: ag.observacoes || '', status: ag.status })
    setAgSelecionado(ag); setModalEditar(true)
  }

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault(); if (!agSelecionado) return; setSalvando(true)
    try {
      const res = await fetch(`/api/agenda/${agSelecionado.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setModalEditar(false); setAgSelecionado(null); await carregarAgendamentos() }
    } finally { setSalvando(false) }
  }

  const confirmarDeletar = (ag: Agendamento) => { setAgSelecionado(ag); setModalDeletar(true) }
  const executarDeletar = async () => {
    if (!agSelecionado) return; setSalvando(true)
    try { await fetch(`/api/agenda/${agSelecionado.id}`, { method: 'DELETE' }); setModalDeletar(false); setAgSelecionado(null); await carregarAgendamentos() }
    finally { setSalvando(false) }
  }

  const abrirDetalhe = (ag: Agendamento) => { setAgSelecionado(ag); setModalDetalhe(true) }

  const alterarStatus = async (id: string, status: string) => {
    await fetch(`/api/agenda/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await carregarAgendamentos()
  }

  // ---- BLOQUEIO CRUD ----
  const abrirNovoBloqueio = () => {
    setFormBloqueio({ tipo: 'dia_inteiro', dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', motivo: '', recorrente: false, diaSemana: '' })
    setBloqueioSelecionado(null); setModalBloqueio(true)
  }

  const abrirEditarBloqueio = (b: Bloqueio) => {
    const dtI = new Date(b.dataInicio)
    setFormBloqueio({
      tipo: b.tipo, dataInicio: dtI.toISOString().split('T')[0],
      dataFim: b.dataFim ? new Date(b.dataFim).toISOString().split('T')[0] : '',
      horaInicio: b.horaInicio || '', horaFim: b.horaFim || '',
      motivo: b.motivo || '', recorrente: b.recorrente, diaSemana: b.diaSemana !== null ? String(b.diaSemana) : '',
    })
    setBloqueioSelecionado(b); setModalBloqueio(true)
  }

  const salvarBloqueio = async (e: React.FormEvent) => {
    e.preventDefault(); setSalvando(true)
    try {
      const payload = {
        ...formBloqueio,
        diaSemana: formBloqueio.recorrente && formBloqueio.diaSemana !== '' ? parseInt(formBloqueio.diaSemana) : null,
        dataFim: formBloqueio.dataFim || null, horaInicio: formBloqueio.horaInicio || null, horaFim: formBloqueio.horaFim || null,
        motivo: formBloqueio.motivo || null,
      }
      if (bloqueioSelecionado) {
        await fetch(`/api/bloqueios/${bloqueioSelecionado.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        await fetch('/api/bloqueios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      setModalBloqueio(false); setBloqueioSelecionado(null); await carregarBloqueios()
    } finally { setSalvando(false) }
  }

  const confirmarDeletarBloqueio = (b: Bloqueio) => { setBloqueioSelecionado(b); setModalDeletarBloqueio(true) }
  const executarDeletarBloqueio = async () => {
    if (!bloqueioSelecionado) return; setSalvando(true)
    try { await fetch(`/api/bloqueios/${bloqueioSelecionado.id}`, { method: 'DELETE' }); setModalDeletarBloqueio(false); setBloqueioSelecionado(null); await carregarBloqueios() }
    finally { setSalvando(false) }
  }

  // ---- GOOGLE SYNC ----
  const sincronizarGoogle = async () => {
    setSincronizando(true); setSyncMsg(null)
    try {
      const res = await fetch('/api/google/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mes: mesAtual, ano: anoAtual, direcao: 'ambos' }) })
      const data = await res.json()
      setSyncMsg(res.ok ? `Sync: ${data.envio?.criados || 0} enviado(s), ${data.importacao?.importados || 0} importado(s)` : `Erro: ${data.error}`)
      if (res.ok) await carregarAgendamentos()
    } catch { setSyncMsg('Erro de conexão') }
    setSincronizando(false); setTimeout(() => setSyncMsg(null), 5000)
  }

  // ---- WHATSAPP ----
  const enviarWhatsApp = (ag: Agendamento, tipo: 'confirmacao' | 'lembrete' | 'cancelamento') => {
    let numero = '', nomeCliente = 'Cliente'
    if (ag.cliente) { numero = (ag.cliente.whatsapp || ag.cliente.telefone).replace(/\D/g, ''); nomeCliente = ag.cliente.nome }
    else { const m = ag.observacoes?.match(/Telefone:\s*(\d+)/); if (m) numero = m[1]; const n = ag.titulo.match(/- (.+)$/); if (n) nomeCliente = n[1] }
    if (!numero) { alert('Nenhum telefone encontrado.'); return }

    const dt = new Date(ag.dataHora)
    const dataStr = dt.toLocaleDateString('pt-BR'), horaStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const msgs: Record<string, string> = {
      confirmacao: `Prezado(a) ${nomeCliente},\n\nConfirmamos seu agendamento:\n\n📅 Data: ${dataStr}\n🕐 Horário: ${horaStr}\n📋 Tipo: ${ag.tipo}\n${ag.local ? `📍 Local: ${ag.local}\n` : ''}\nQualquer dúvida, estamos à disposição.\n\nCerbelera & Oliveira Advogados\n📞 (18) 99610-1884`,
      lembrete: `Prezado(a) ${nomeCliente},\n\nLembramos do seu compromisso:\n\n📅 Data: ${dataStr}\n🕐 Horário: ${horaStr}\n📋 Tipo: ${ag.tipo}\n${ag.local ? `📍 Local: ${ag.local}\n` : ''}\nCaso precise remarcar, entre em contato.\n\nCerbelera & Oliveira Advogados\n📞 (18) 99610-1884`,
      cancelamento: `Prezado(a) ${nomeCliente},\n\nSeu agendamento foi cancelado:\n\n📅 Data: ${dataStr}\n🕐 Horário: ${horaStr}\n\nPara reagendar, acesse nosso site ou entre em contato.\n\nCerbelera & Oliveira Advogados\n📞 (18) 99610-1884`,
    }
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(msgs[tipo])}`, '_blank')
  }

  // ---- HELPERS ----
  const isOrigemSite = (ag: Agendamento) => ag.observacoes?.includes('Agendamento via site') || ag.observacoes?.includes('Triagem #')

  const agrupadoPorDia: Record<string, Agendamento[]> = {}
  const agFiltrados = filtroStatus ? agendamentos.filter(a => a.status === filtroStatus) : agendamentos
  agFiltrados.forEach(ag => {
    const dia = new Date(ag.dataHora).toLocaleDateString('pt-BR')
    if (!agrupadoPorDia[dia]) agrupadoPorDia[dia] = []
    agrupadoPorDia[dia].push(ag)
  })

  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter(a => a.status === 'pendente').length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    realizados: agendamentos.filter(a => a.status === 'realizado').length,
    origemSite: agendamentos.filter(a => isOrigemSite(a)).length,
  }

  const gerarCalendario = () => {
    const p = new Date(anoAtual, mesAtual - 1, 1), u = new Date(anoAtual, mesAtual, 0)
    const dias: (number | null)[] = []
    for (let i = 0; i < p.getDay(); i++) dias.push(null)
    for (let i = 1; i <= u.getDate(); i++) dias.push(i)
    return dias
  }

  const agendamentosNoDia = (dia: number) =>
    agFiltrados.filter(ag => { const d = new Date(ag.dataHora); return d.getDate() === dia && d.getMonth() === mesAtual - 1 && d.getFullYear() === anoAtual })

  // Bloqueios ativos
  const bloqueiosAtivos = bloqueios.filter(b => b.ativo)
  const bloqueiosRecorrentes = bloqueiosAtivos.filter(b => b.recorrente)
  const bloqueiosPontuais = bloqueiosAtivos.filter(b => !b.recorrente)

  // ---- FORM AGENDAMENTO ----
  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Título" obrigatorio>
        <FormInput value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required placeholder="Consulta inicial" />
      </FormField>
      <FormField label="Cliente">
        <FormSelect value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})}>
          <option value="">Sem cliente vinculado</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </FormSelect>
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Data e Hora" obrigatorio>
          <FormInput type="datetime-local" value={form.dataHora} onChange={e => setForm({...form, dataHora: e.target.value})} required />
        </FormField>
        <FormField label="Duração (min)">
          <FormInput type="number" value={form.duracao} onChange={e => setForm({...form, duracao: e.target.value})} />
        </FormField>
        <FormField label="Tipo">
          <FormSelect value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
            {TIPO_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Local">
          <FormInput value={form.local} onChange={e => setForm({...form, local: e.target.value})} placeholder="Escritório" />
        </FormField>
      </div>
      {isEdit && (
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </FormSelect>
        </FormField>
      )}
      <FormField label="Descrição"><FormTextarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={2} /></FormField>
      <FormField label="Observações"><FormTextarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} rows={2} placeholder="Notas internas..." /></FormField>
      {googleConectado && (
        <div className="flex items-center gap-2 p-3 bg-blue-900/10 border border-blue-700/20 rounded-lg">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
          <p className="text-xs text-blue-400">{isEdit ? 'Alterações serão sincronizadas' : 'Será criado no'} Google Calendar</p>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
        <FormButton variant="secondary" type="button" onClick={() => isEdit ? setModalEditar(false) : setModalNovo(false)}>Cancelar</FormButton>
        <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Agendar'}</FormButton>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-[#6b8a6f] text-sm">{stats.total} agendamento(s)</p>
            {stats.pendentes > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-900/20 text-yellow-400 border border-yellow-700/30">⏳ {stats.pendentes} pendente(s)</span>}
            {stats.origemSite > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-900/20 text-purple-400 border border-purple-700/30">🌐 {stats.origemSite} via site</span>}
            {bloqueiosAtivos.length > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-900/20 text-red-400 border border-red-700/30">🚫 {bloqueiosAtivos.length} bloqueio(s)</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {googleConectado ? (
            <button onClick={sincronizarGoogle} disabled={sincronizando}
              className="px-3 py-2 text-xs bg-blue-900/20 border border-blue-700/30 text-blue-400 rounded-lg hover:bg-blue-900/40 disabled:opacity-50 flex items-center gap-1.5">
              {sincronizando ? <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> :
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
              {sincronizando ? 'Sincronizando...' : 'Sync Google'}
            </button>
          ) : (
            <a href="/painel/configuracoes?aba=google" className="px-3 py-2 text-xs bg-[#0e1810] border border-[#2a3f2e] text-[#8a9f8e] rounded-lg hover:border-blue-700/30 hover:text-blue-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
              Conectar Google
            </a>
          )}
          <button onClick={abrirNovo} className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white text-sm font-medium rounded-lg hover:from-[#d4b55a] hover:to-[#c9a84c]">+ Novo</button>
        </div>
      </div>

      {syncMsg && <div className={`p-3 rounded-lg text-sm ${syncMsg.startsWith('Erro') ? 'bg-red-900/20 text-red-400 border border-red-700/30' : 'bg-blue-900/20 text-blue-400 border border-blue-700/30'}`}>{syncMsg}</div>}

      {/* Tabs */}
      <div className="flex bg-[#0e1810] border border-[#2a3f2e] rounded-xl overflow-hidden">
        <button onClick={() => setTab('agendamentos')} className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all ${tab === 'agendamentos' ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-b-2 border-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>
          📅 Agendamentos
        </button>
        <button onClick={() => setTab('disponibilidade')} className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all ${tab === 'disponibilidade' ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-b-2 border-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>
          🕐 Disponibilidade {bloqueiosAtivos.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded text-[10px]">{bloqueiosAtivos.length}</span>}
        </button>
      </div>

      {/* ============ TAB AGENDAMENTOS ============ */}
      {tab === 'agendamentos' && (
        <>
          {/* Mini Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, cor: 'text-white' },
              { label: 'Pendentes', value: stats.pendentes, cor: 'text-yellow-400' },
              { label: 'Confirmados', value: stats.confirmados, cor: 'text-green-400' },
              { label: 'Realizados', value: stats.realizados, cor: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-3 text-center">
                <p className={`text-xl font-bold ${s.cor}`}>{s.value}</p>
                <p className="text-[10px] text-[#6b8a6f]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filtros + Views */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="px-3 py-2 text-xs bg-[#0e1810] border border-[#2a3f2e] text-[#8a9f8e] rounded-lg">
                <option value="">Todos os status</option>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className="flex bg-[#0e1810] border border-[#2a3f2e] rounded-lg overflow-hidden">
                <button onClick={() => setVisualizacao('lista')} className={`px-3 py-2 text-xs ${visualizacao === 'lista' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>Lista</button>
                <button onClick={() => setVisualizacao('calendario')} className={`px-3 py-2 text-xs ${visualizacao === 'calendario' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-[#8a9f8e] hover:text-white'}`}>Calendário</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navegarMes(-1)} className="p-1.5 rounded-lg text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]">‹</button>
              <h2 className="text-sm font-semibold text-white min-w-[160px] text-center">{meses[mesAtual - 1]} {anoAtual}</h2>
              <button onClick={() => navegarMes(1)} className="p-1.5 rounded-lg text-[#8a9f8e] hover:text-white hover:bg-[#1a2e1f]">›</button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
          ) : visualizacao === 'calendario' ? (
            <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
              <div className="grid grid-cols-7 gap-1">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="text-center text-xs font-medium text-[#8a9f8e] py-2">{d}</div>)}
                {gerarCalendario().map((dia, i) => {
                  const ags = dia ? agendamentosNoDia(dia) : []
                  const isHoje = dia && new Date().getDate() === dia && new Date().getMonth() === mesAtual - 1 && new Date().getFullYear() === anoAtual
                  // Verificar se dia está bloqueado
                  const dataDia = dia ? new Date(anoAtual, mesAtual - 1, dia) : null
                  const diaBloqueado = dataDia && bloqueiosAtivos.some(b => {
                    if (b.recorrente && b.diaSemana === dataDia.getDay() && b.tipo === 'dia_inteiro') return true
                    if (!b.recorrente && b.tipo === 'dia_inteiro') {
                      const bi = new Date(b.dataInicio); bi.setHours(0,0,0,0)
                      const bf = b.dataFim ? new Date(b.dataFim) : new Date(b.dataInicio); bf.setHours(23,59,59)
                      return dataDia >= bi && dataDia <= bf
                    }
                    return false
                  })
                  return (
                    <div key={i} className={`min-h-[80px] p-1 rounded-lg border ${dia ? (diaBloqueado ? 'border-red-700/30 bg-red-900/5' : isHoje ? 'border-[#c9a84c]/50 bg-[#c9a84c]/5' : 'border-[#2a3f2e]/50 hover:border-[#2a3f2e]') : 'border-transparent'}`}>
                      {dia && (
                        <>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-medium ${diaBloqueado ? 'text-red-400' : isHoje ? 'text-[#c9a84c]' : 'text-[#8a9f8e]'}`}>{dia}</p>
                            {diaBloqueado && <span className="text-[8px] text-red-400">🚫</span>}
                          </div>
                          {ags.slice(0, 3).map(ag => (
                            <button key={ag.id} onClick={() => abrirDetalhe(ag)} className={`w-full text-left text-[10px] px-1 py-0.5 mb-0.5 rounded truncate hover:opacity-80 ${ag.status === 'pendente' ? 'bg-yellow-900/20 text-yellow-300' : ag.status === 'confirmado' ? 'bg-green-900/20 text-green-300' : ag.status === 'cancelado' ? 'bg-red-900/20 text-red-300 line-through' : 'bg-[#1a2e1f] text-[#b0c4b4]'}`}>
                              {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {ag.titulo.substring(0, 18)}
                            </button>
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
              ) : Object.entries(agrupadoPorDia).map(([dia, ags]) => (
                <div key={dia}>
                  <h3 className="text-sm font-medium text-[#c9a84c] mb-2 flex items-center gap-2">{dia} <span className="text-[10px] text-[#6b8a6f]">({ags.length})</span></h3>
                  <div className="space-y-2">
                    {ags.map(ag => (
                      <div key={ag.id} className={`bg-[#0e1810] border rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors ${ag.status === 'pendente' ? 'border-yellow-700/30' : ag.status === 'cancelado' ? 'border-red-700/20 opacity-60' : 'border-[#2a3f2e]'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => abrirDetalhe(ag)}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-white">{ag.titulo}</p>
                              {ag.googleEventId && <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-900/20 text-blue-400 border border-blue-700/30">Google</span>}
                              {isOrigemSite(ag) && <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-900/20 text-purple-400 border border-purple-700/30">🌐 Site</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#6b8a6f]">
                              <span>{new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                              <span>{ag.duracao}min</span>
                              <span className="capitalize">{ag.tipo}</span>
                              {ag.local && <span>{ag.local}</span>}
                            </div>
                            {ag.cliente && <p className="text-xs text-[#8a9f8e] mt-1">👤 {ag.cliente.nome}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <StatusBadge status={ag.status} />
                            {/* WhatsApp */}
                            <div className="relative group">
                              <button className="p-1.5 rounded-lg text-green-500 hover:bg-green-900/30" title="WhatsApp">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                              </button>
                              <div className="absolute right-0 top-full mt-1 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg shadow-xl py-1 hidden group-hover:block z-20 min-w-[160px]">
                                <button onClick={() => enviarWhatsApp(ag, 'confirmacao')} className="w-full text-left px-3 py-1.5 text-xs text-[#b0c4b4] hover:bg-[#2a3f2e] hover:text-white">✅ Confirmação</button>
                                <button onClick={() => enviarWhatsApp(ag, 'lembrete')} className="w-full text-left px-3 py-1.5 text-xs text-[#b0c4b4] hover:bg-[#2a3f2e] hover:text-white">🔔 Lembrete</button>
                                <button onClick={() => enviarWhatsApp(ag, 'cancelamento')} className="w-full text-left px-3 py-1.5 text-xs text-[#b0c4b4] hover:bg-[#2a3f2e] hover:text-white">❌ Cancelamento</button>
                              </div>
                            </div>
                            <button onClick={() => abrirEditar(ag)} className="p-1.5 rounded-lg text-[#8a9f8e] hover:bg-[#1a2e1f] hover:text-white" title="Editar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button onClick={() => confirmarDeletar(ag)} className="p-1.5 rounded-lg text-red-400/60 hover:bg-red-900/20 hover:text-red-400" title="Excluir">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                            <select value={ag.status} onChange={e => alterarStatus(ag.id, e.target.value)} className="px-2 py-1 text-xs bg-[#1a2e1f] border border-[#2a3f2e] rounded text-white max-w-[110px]">
                              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ TAB DISPONIBILIDADE ============ */}
      {tab === 'disponibilidade' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6b8a6f] text-sm">Gerencie quando o advogado estará <strong className="text-[#b0c4b4]">indisponível</strong>. Os bloqueios impedem clientes de agendar online nestes horários.</p>
            </div>
            <button onClick={abrirNovoBloqueio} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              Bloquear Horário
            </button>
          </div>

          {/* Bloqueios recorrentes */}
          {bloqueiosRecorrentes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#c9a84c] mb-3 flex items-center gap-2">🔁 Recorrentes <span className="text-[10px] text-[#6b8a6f]">(se repetem toda semana)</span></h3>
              <div className="space-y-2">
                {bloqueiosRecorrentes.map(b => (
                  <div key={b.id} className="bg-[#0e1810] border border-red-700/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{b.diaSemana !== null ? DIAS_SEMANA[b.diaSemana] : 'Não definido'}</p>
                      <div className="flex items-center gap-3 text-xs text-[#6b8a6f] mt-1">
                        <span>{b.tipo === 'dia_inteiro' ? 'Dia inteiro' : `${b.horaInicio} - ${b.horaFim}`}</span>
                        {b.motivo && <span>• {b.motivo}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditarBloqueio(b)} className="p-1.5 rounded-lg text-[#8a9f8e] hover:bg-[#1a2e1f] hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => confirmarDeletarBloqueio(b)} className="p-1.5 rounded-lg text-red-400/60 hover:bg-red-900/20 hover:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloqueios pontuais */}
          <div>
            <h3 className="text-sm font-medium text-[#c9a84c] mb-3 flex items-center gap-2">📅 Pontuais <span className="text-[10px] text-[#6b8a6f]">(datas específicas)</span></h3>
            {bloqueiosPontuais.length === 0 ? (
              <p className="text-center text-[#6b8a6f] py-8 text-sm">Nenhum bloqueio pontual ativo</p>
            ) : (
              <div className="space-y-2">
                {bloqueiosPontuais.map(b => {
                  const dtI = new Date(b.dataInicio)
                  const dtF = b.dataFim ? new Date(b.dataFim) : null
                  const passado = dtF ? dtF < new Date() : dtI < new Date()
                  return (
                    <div key={b.id} className={`bg-[#0e1810] border rounded-xl p-4 flex items-center justify-between ${passado ? 'border-[#2a3f2e] opacity-50' : 'border-red-700/20'}`}>
                      <div>
                        <p className="text-sm text-white font-medium">
                          {dtI.toLocaleDateString('pt-BR')}
                          {dtF && dtF.toDateString() !== dtI.toDateString() && ` → ${dtF.toLocaleDateString('pt-BR')}`}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#6b8a6f] mt-1">
                          <span>{b.tipo === 'dia_inteiro' ? 'Dia inteiro' : `${b.horaInicio} - ${b.horaFim}`}</span>
                          {b.motivo && <span>• {b.motivo}</span>}
                          {passado && <span className="text-yellow-400/60">• Passado</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditarBloqueio(b)} className="p-1.5 rounded-lg text-[#8a9f8e] hover:bg-[#1a2e1f] hover:text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => confirmarDeletarBloqueio(b)} className="p-1.5 rounded-lg text-red-400/60 hover:bg-red-900/20 hover:text-red-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Dicas */}
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#c9a84c] mb-3">💡 Como funciona</h4>
            <ul className="space-y-2 text-xs text-[#8a9f8e]">
              <li>• <strong className="text-[#b0c4b4]">Dia inteiro:</strong> Bloqueia todas as vagas do dia (férias, viagem, feriado)</li>
              <li>• <strong className="text-[#b0c4b4]">Período:</strong> Bloqueia apenas parte do dia (manhã ou tarde)</li>
              <li>• <strong className="text-[#b0c4b4]">Recorrente:</strong> Se repete toda semana (ex: quarta-feira sem atendimento)</li>
              <li>• Clientes no site verão os dias/horários bloqueados como <span className="text-red-400">indisponíveis</span></li>
              <li>• Agendamentos pendentes precisam de <span className="text-yellow-400">aprovação</span> do advogado via CMS</li>
            </ul>
          </div>
        </div>
      )}

      {/* ============ MODAIS AGENDAMENTO ============ */}
      <Modal aberto={modalNovo} onFechar={() => setModalNovo(false)} titulo="Novo Agendamento" tamanho="lg">{renderForm(salvarNovo, false)}</Modal>
      <Modal aberto={modalEditar} onFechar={() => { setModalEditar(false); setAgSelecionado(null) }} titulo="Editar Agendamento" tamanho="lg">{renderForm(salvarEdicao, true)}</Modal>

      {/* Modal DETALHE */}
      <Modal aberto={modalDetalhe} onFechar={() => { setModalDetalhe(false); setAgSelecionado(null) }} titulo="Detalhes do Agendamento" tamanho="lg">
        {agSelecionado && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={agSelecionado.status} />
              {agSelecionado.googleEventId && <span className="px-2 py-0.5 rounded text-[10px] bg-blue-900/20 text-blue-400 border border-blue-700/30">Google Calendar</span>}
              {isOrigemSite(agSelecionado) && <span className="px-2 py-0.5 rounded text-[10px] bg-purple-900/20 text-purple-400 border border-purple-700/30">🌐 Via Site</span>}
            </div>
            <h3 className="text-lg font-semibold text-white">{agSelecionado.titulo}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Data e Hora', new Date(agSelecionado.dataHora).toLocaleString('pt-BR')],
                ['Duração', `${agSelecionado.duracao} min`],
                ['Tipo', agSelecionado.tipo],
                ['Local', agSelecionado.local || 'Não informado'],
              ].map(([l, v]) => (
                <div key={l} className="bg-[#1a2e1f] rounded-lg p-3">
                  <p className="text-[10px] text-[#6b8a6f] mb-1">{l}</p>
                  <p className="text-sm text-white capitalize">{v}</p>
                </div>
              ))}
            </div>
            {agSelecionado.cliente && (
              <div className="bg-[#1a2e1f] rounded-lg p-3">
                <p className="text-[10px] text-[#6b8a6f] mb-1">Cliente</p>
                <p className="text-sm text-white">{agSelecionado.cliente.nome}</p>
                <p className="text-xs text-[#8a9f8e]">{agSelecionado.cliente.telefone}</p>
              </div>
            )}
            {agSelecionado.observacoes && (
              <div className="bg-[#1a2e1f] rounded-lg p-3">
                <p className="text-[10px] text-[#6b8a6f] mb-1">Observações</p>
                <p className="text-sm text-[#b0c4b4] whitespace-pre-line">{agSelecionado.observacoes}</p>
              </div>
            )}
            <p className="text-[10px] text-[#6b8a6f]">Criado em: {new Date(agSelecionado.criadoEm).toLocaleString('pt-BR')}</p>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2a3f2e]">
              <button onClick={() => { setModalDetalhe(false); abrirEditar(agSelecionado) }} className="px-4 py-2 text-sm bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded-lg hover:bg-[#c9a84c]/30">✏️ Editar</button>
              {agSelecionado.status === 'pendente' && (
                <button onClick={() => { alterarStatus(agSelecionado.id, 'confirmado'); enviarWhatsApp(agSelecionado, 'confirmacao'); setModalDetalhe(false); setAgSelecionado(null) }}
                  className="px-4 py-2 text-sm bg-green-900/20 text-green-400 border border-green-700/30 rounded-lg hover:bg-green-900/30">✅ Aprovar + WhatsApp</button>
              )}
              <button onClick={() => enviarWhatsApp(agSelecionado, 'lembrete')} className="px-4 py-2 text-sm bg-blue-900/20 text-blue-400 border border-blue-700/30 rounded-lg hover:bg-blue-900/30">🔔 Lembrete</button>
              {agSelecionado.status !== 'cancelado' && (
                <button onClick={() => { alterarStatus(agSelecionado.id, 'cancelado'); enviarWhatsApp(agSelecionado, 'cancelamento'); setModalDetalhe(false); setAgSelecionado(null) }}
                  className="px-4 py-2 text-sm bg-red-900/20 text-red-400 border border-red-700/30 rounded-lg hover:bg-red-900/30">❌ Cancelar + Avisar</button>
              )}
              <button onClick={() => { setModalDetalhe(false); confirmarDeletar(agSelecionado) }} className="px-4 py-2 text-sm bg-red-900/20 text-red-400 border border-red-700/30 rounded-lg hover:bg-red-900/30 ml-auto">🗑 Excluir</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal CONFIRMAR DELETE AGENDAMENTO */}
      <Modal aberto={modalDeletar} onFechar={() => { setModalDeletar(false); setAgSelecionado(null) }} titulo="Excluir Agendamento" tamanho="sm">
        <div className="space-y-4">
          <p className="text-sm text-[#b0c4b4]">Excluir <strong className="text-white">&quot;{agSelecionado?.titulo}&quot;</strong>?</p>
          {agSelecionado?.googleEventId && <p className="text-xs text-blue-400 p-3 bg-blue-900/10 border border-blue-700/20 rounded-lg">⚠️ Também será removido do Google Calendar.</p>}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" onClick={() => { setModalDeletar(false); setAgSelecionado(null) }}>Cancelar</FormButton>
            <button onClick={executarDeletar} disabled={salvando} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{salvando ? 'Excluindo...' : 'Excluir'}</button>
          </div>
        </div>
      </Modal>

      {/* ============ MODAIS BLOQUEIO ============ */}
      <Modal aberto={modalBloqueio} onFechar={() => { setModalBloqueio(false); setBloqueioSelecionado(null) }} titulo={bloqueioSelecionado ? 'Editar Bloqueio' : 'Novo Bloqueio de Horário'} tamanho="md">
        <form onSubmit={salvarBloqueio} className="space-y-4">
          <FormField label="Tipo de Bloqueio" obrigatorio>
            <FormSelect value={formBloqueio.tipo} onChange={e => setFormBloqueio({...formBloqueio, tipo: e.target.value})}>
              <option value="dia_inteiro">🚫 Dia Inteiro (férias, viagem, feriado)</option>
              <option value="periodo">🕐 Período (manhã ou tarde)</option>
            </FormSelect>
          </FormField>

          <div className="flex items-center gap-3 p-3 bg-[#1a2e1f] rounded-lg">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={formBloqueio.recorrente} onChange={e => setFormBloqueio({...formBloqueio, recorrente: e.target.checked})} className="accent-[#c9a84c]" />
              Repetir toda semana
            </label>
          </div>

          {formBloqueio.recorrente ? (
            <FormField label="Dia da Semana" obrigatorio>
              <FormSelect value={formBloqueio.diaSemana} onChange={e => setFormBloqueio({...formBloqueio, diaSemana: e.target.value})} required>
                <option value="">Selecione...</option>
                {DIAS_SEMANA.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </FormSelect>
            </FormField>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Data Início" obrigatorio>
                <FormInput type="date" value={formBloqueio.dataInicio} onChange={e => setFormBloqueio({...formBloqueio, dataInicio: e.target.value})} required />
              </FormField>
              <FormField label="Data Fim (opcional)">
                <FormInput type="date" value={formBloqueio.dataFim} onChange={e => setFormBloqueio({...formBloqueio, dataFim: e.target.value})} />
              </FormField>
            </div>
          )}

          {formBloqueio.tipo === 'periodo' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Hora Início" obrigatorio>
                <FormInput type="time" value={formBloqueio.horaInicio} onChange={e => setFormBloqueio({...formBloqueio, horaInicio: e.target.value})} required />
              </FormField>
              <FormField label="Hora Fim" obrigatorio>
                <FormInput type="time" value={formBloqueio.horaFim} onChange={e => setFormBloqueio({...formBloqueio, horaFim: e.target.value})} required />
              </FormField>
            </div>
          )}

          <FormField label="Motivo">
            <FormInput value={formBloqueio.motivo} onChange={e => setFormBloqueio({...formBloqueio, motivo: e.target.value})} placeholder="Ex: Férias, audiência externa, viagem..." />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => { setModalBloqueio(false); setBloqueioSelecionado(null) }}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : bloqueioSelecionado ? 'Salvar' : 'Criar Bloqueio'}</FormButton>
          </div>
        </form>
      </Modal>

      {/* Modal CONFIRMAR DELETE BLOQUEIO */}
      <Modal aberto={modalDeletarBloqueio} onFechar={() => { setModalDeletarBloqueio(false); setBloqueioSelecionado(null) }} titulo="Remover Bloqueio" tamanho="sm">
        <div className="space-y-4">
          <p className="text-sm text-[#b0c4b4]">Remover este bloqueio? Os horários ficarão disponíveis novamente para agendamento.</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" onClick={() => { setModalDeletarBloqueio(false); setBloqueioSelecionado(null) }}>Cancelar</FormButton>
            <button onClick={executarDeletarBloqueio} disabled={salvando} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">{salvando ? 'Removendo...' : 'Remover'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
