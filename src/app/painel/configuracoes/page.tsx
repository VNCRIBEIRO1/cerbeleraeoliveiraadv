'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Modal, { FormField, FormInput, FormButton } from '@/components/painel/Modal'

interface Usuario {
  id: string; nome: string; email: string; role: string; ativo: boolean; criadoEm: string
}

export default function ConfiguracoesPage() {
  const searchParams = useSearchParams()
  const abaInicial = searchParams.get('aba') || 'geral'
  const googleStatus = searchParams.get('google')

  const [aba, setAba] = useState<'geral' | 'google' | 'usuarios' | 'backup'>(abaInicial as 'geral' | 'google' | 'usuarios' | 'backup')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [modalSenha, setModalSenha] = useState(false)
  const [senhaForm, setSenhaForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  // Google Calendar state
  const [googleConectado, setGoogleConectado] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [conectandoGoogle, setConectandoGoogle] = useState(false)
  const [desconectandoGoogle, setDesconectandoGoogle] = useState(false)

  // Mostrar mensagem do callback do Google
  useEffect(() => {
    if (googleStatus === 'sucesso') {
      setMsg({ tipo: 'sucesso', texto: 'Google Calendar vinculado com sucesso! Seus agendamentos serão sincronizados automaticamente.' })
      setAba('google')
    } else if (googleStatus === 'erro') {
      const motivo = searchParams.get('motivo')
      setMsg({ tipo: 'erro', texto: `Erro ao vincular Google Calendar: ${motivo || 'desconhecido'}` })
      setAba('google')
    }
  }, [googleStatus, searchParams])

  // Verificar status Google Calendar
  useEffect(() => {
    if (aba === 'google') {
      setGoogleLoading(true)
      fetch('/api/google/sync')
        .then(r => r.json())
        .then(data => setGoogleConectado(!!data.conectado))
        .catch(() => setGoogleConectado(false))
        .finally(() => setGoogleLoading(false))
    }
  }, [aba])

  const carregarUsuarios = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        const u = data.user || data
        setUsuarios([{ id: u.userId || u.id || '', nome: u.nome || '', email: u.email || '', role: u.role || '', ativo: true, criadoEm: '' }])
      }
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (aba === 'usuarios') carregarUsuarios()
  }, [aba])

  const alterarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (senhaForm.novaSenha !== senhaForm.confirmar) {
      setMsg({ tipo: 'erro', texto: 'As senhas não coincidem' }); return
    }
    if (senhaForm.novaSenha.length < 6) {
      setMsg({ tipo: 'erro', texto: 'A nova senha deve ter pelo menos 6 caracteres' }); return
    }
    setSalvando(true)
    try {
      const res = await fetch('/api/auth/senha', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual: senhaForm.senhaAtual, novaSenha: senhaForm.novaSenha }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ tipo: 'erro', texto: data.error || 'Erro ao alterar senha' })
        return
      }
      setMsg({ tipo: 'sucesso', texto: 'Senha alterada com sucesso' })
      setModalSenha(false)
      setSenhaForm({ senhaAtual: '', novaSenha: '', confirmar: '' })
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro de conexão' })
    } finally { setSalvando(false) }
  }

  const conectarGoogle = async () => {
    setConectandoGoogle(true)
    try {
      const res = await fetch('/api/google/auth')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMsg({ tipo: 'erro', texto: data.error || 'Erro ao iniciar conexão com Google' })
        setConectandoGoogle(false)
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro de conexão. Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configurados.' })
      setConectandoGoogle(false)
    }
  }

  const desconectarGoogle = async () => {
    if (!confirm('Deseja desconectar o Google Calendar? Os agendamentos existentes não serão afetados, mas novos não serão sincronizados.')) return
    setDesconectandoGoogle(true)
    try {
      const res = await fetch('/api/google/disconnect', { method: 'POST' })
      if (res.ok) {
        setGoogleConectado(false)
        setMsg({ tipo: 'sucesso', texto: 'Google Calendar desconectado' })
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao desconectar' })
    } finally { setDesconectandoGoogle(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-[#6b8a6f] text-sm mt-1">Gerenciar sistema, integrações e conta</p>
      </div>

      {msg && (
        <div className={`p-3 rounded-lg text-sm ${msg.tipo === 'sucesso' ? 'bg-green-900/20 text-green-400 border border-green-700/30' : 'bg-red-900/20 text-red-400 border border-red-700/30'}`}>
          {msg.texto}
          <button onClick={() => setMsg(null)} className="ml-2 underline text-xs">Fechar</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0e1810] border border-[#2a3f2e] rounded-lg p-1 overflow-x-auto">
        {([['geral', 'Geral'], ['google', 'Google Calendar'], ['usuarios', 'Usuários'], ['backup', 'Backup']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setAba(v)}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
              aba === v ? 'bg-[#1a2e1f] text-white' : 'text-[#8a9f8e] hover:text-white'
            }`}>{l}</button>
        ))}
      </div>

      {/* ====== ABA GERAL ====== */}
      {aba === 'geral' && (
        <div className="space-y-4">
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Escritório', 'Cerbelera & Oliveira Advogados Associados'],
                ['Versão', '1.0.0'],
                ['Banco de Dados', 'PostgreSQL (Neon)'],
                ['Framework', 'Next.js'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[#6b8a6f] text-xs">{k}</p>
                  <p className="text-white">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Segurança</h3>
            <button onClick={() => setModalSenha(true)}
              className="px-4 py-2 text-sm bg-[#1a2e1f] border border-[#2a3f2e] text-white rounded-lg hover:border-[#c9a84c]/30">
              Alterar Senha
            </button>
          </div>

          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">WhatsApp</h3>
            <p className="text-xs text-[#6b8a6f] mb-2">Número principal para contato com clientes</p>
            <p className="text-white text-sm">(18) 99610-1884</p>
          </div>
        </div>
      )}

      {/* ====== ABA GOOGLE CALENDAR ====== */}
      {aba === 'google' && (
        <div className="space-y-4">
          {/* Status da conexão */}
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-900/20 border border-blue-700/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Google Calendar</h3>
                <p className="text-sm text-[#6b8a6f] mt-1">
                  Sincronize seus agendamentos automaticamente com o Google Calendar
                </p>
                {googleLoading ? (
                  <div className="mt-3"><div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>
                ) : googleConectado ? (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-700/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Conectado
                    </span>
                    <button onClick={desconectarGoogle} disabled={desconectandoGoogle}
                      className="px-3 py-1 text-xs bg-red-900/20 text-red-400 border border-red-700/30 rounded-lg hover:bg-red-900/40 disabled:opacity-50">
                      {desconectandoGoogle ? 'Desconectando...' : 'Desconectar'}
                    </button>
                  </div>
                ) : (
                  <button onClick={conectarGoogle} disabled={conectandoGoogle}
                    className="mt-3 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    {conectandoGoogle ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
                    )}
                    {conectandoGoogle ? 'Redirecionando...' : 'Conectar Google Calendar'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Como funciona */}
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Como funciona a integração</h3>
            <div className="space-y-3">
              {[
                { icone: '1', titulo: 'Criação automática', desc: 'Ao criar um agendamento no sistema, ele é automaticamente criado no seu Google Calendar com lembretes.' },
                { icone: '2', titulo: 'Atualização em tempo real', desc: 'Alterações de horário, local ou status são sincronizadas automaticamente.' },
                { icone: '3', titulo: 'Sincronização bidirecional', desc: 'Use o botão "Sync Google" na agenda para importar eventos do Google e exportar agendamentos pendentes.' },
                { icone: '4', titulo: 'Cores por tipo', desc: 'Audiências (vermelho), Prazos (laranja), Reuniões (azul), Consultas (verde), Retornos (amarelo).' },
                { icone: '5', titulo: 'Lembretes', desc: 'Cada evento recebe lembretes automáticos: 30 minutos antes e 1 dia antes.' },
              ].map(item => (
                <div key={item.icone} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#c9a84c]/20 text-[#c9a84c] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{item.icone}</div>
                  <div>
                    <p className="text-sm text-white font-medium">{item.titulo}</p>
                    <p className="text-xs text-[#6b8a6f] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instruções de configuração */}
          {!googleConectado && (
            <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Configuração Inicial (Administrador)</h3>
              <p className="text-xs text-[#6b8a6f] mb-3">
                Para ativar a integração, é necessário configurar as credenciais do Google Cloud Console:
              </p>
              <div className="p-3 bg-[#1a2e1f] rounded-lg text-xs text-[#b0c4b4] font-mono space-y-1">
                <p className="text-[#6b8a6f]"># 1. Acesse console.cloud.google.com</p>
                <p className="text-[#6b8a6f]"># 2. Crie um projeto e ative a Google Calendar API</p>
                <p className="text-[#6b8a6f]"># 3. Crie credenciais OAuth 2.0 (Web Application)</p>
                <p className="text-[#6b8a6f]"># 4. Adicione o redirect URI:</p>
                <p className="text-white">https://cerbeleraeoliveiraadv.vercel.app/api/google/callback</p>
                <p className="text-[#6b8a6f] mt-2"># 5. Configure as variáveis no Vercel:</p>
                <p className="text-white">GOOGLE_CLIENT_ID=seu_client_id</p>
                <p className="text-white">GOOGLE_CLIENT_SECRET=seu_client_secret</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== ABA USUÁRIOS ====== */}
      {aba === 'usuarios' && (
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Usuários do Sistema</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {usuarios.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-[#1a2e1f] rounded-lg">
                  <div>
                    <p className="text-sm text-white font-medium">{u.nome}</p>
                    <p className="text-xs text-[#6b8a6f]">{u.email} • {u.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${u.ativo ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-[#6b8a6f] mt-4">Para registrar novos usuários, utilize a tela de login com a chave de administração.</p>
        </div>
      )}

      {/* ====== ABA BACKUP ====== */}
      {aba === 'backup' && (
        <div className="space-y-4">
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Exportar Dados</h3>
            <p className="text-xs text-[#6b8a6f] mb-4">Exporte os dados do sistema em formato CSV ou JSON</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { tipo: 'clientes', label: 'Clientes' },
                { tipo: 'processos', label: 'Processos' },
                { tipo: 'financeiro', label: 'Financeiro' },
                { tipo: 'prazos', label: 'Prazos' },
              ].map(exp => (
                <div key={exp.tipo} className="space-y-2">
                  <p className="text-xs text-white font-medium">{exp.label}</p>
                  <div className="flex gap-1">
                    <a href={`/api/exportar?tipo=${exp.tipo}&formato=csv`}
                      className="flex-1 px-2 py-1 text-[10px] text-center bg-[#1a2e1f] border border-[#2a3f2e] text-[#8a9f8e] rounded hover:text-white">CSV</a>
                    <a href={`/api/exportar?tipo=${exp.tipo}&formato=json`}
                      className="flex-1 px-2 py-1 text-[10px] text-center bg-[#1a2e1f] border border-[#2a3f2e] text-[#8a9f8e] rounded hover:text-white">JSON</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Banco de Dados na Nuvem</h3>
            <p className="text-xs text-[#6b8a6f] mb-2">
              O banco de dados PostgreSQL está hospedado no <span className="text-white font-semibold">Neon</span> via Vercel.
              Os dados são persistentes e com backup automático.
            </p>
            <p className="text-xs text-[#6b8a6f]">
              Para acessar o painel do banco, vá ao <span className="text-white">Dashboard do Vercel</span> → Storage → Neon Console.
            </p>
          </div>
        </div>
      )}

      {/* Modal Alterar Senha */}
      <Modal aberto={modalSenha} onFechar={() => setModalSenha(false)} titulo="Alterar Senha">
        <form onSubmit={alterarSenha} className="space-y-4">
          <FormField label="Senha Atual" obrigatorio>
            <FormInput type="password" value={senhaForm.senhaAtual} onChange={e => setSenhaForm({...senhaForm, senhaAtual: e.target.value})} required />
          </FormField>
          <FormField label="Nova Senha" obrigatorio>
            <FormInput type="password" value={senhaForm.novaSenha} onChange={e => setSenhaForm({...senhaForm, novaSenha: e.target.value})} required />
          </FormField>
          <FormField label="Confirmar Nova Senha" obrigatorio>
            <FormInput type="password" value={senhaForm.confirmar} onChange={e => setSenhaForm({...senhaForm, confirmar: e.target.value})} required />
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a3f2e]">
            <FormButton variant="secondary" type="button" onClick={() => setModalSenha(false)}>Cancelar</FormButton>
            <FormButton type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Alterar Senha'}</FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
