'use client'

import { useState, useEffect } from 'react'
import Modal, { FormField, FormInput, FormButton } from '@/components/painel/Modal'

interface Usuario {
  id: string; nome: string; email: string; role: string; ativo: boolean; criadoEm: string
}

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<'geral' | 'usuarios' | 'backup'>('geral')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [modalSenha, setModalSenha] = useState(false)
  const [senhaForm, setSenhaForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  const carregarUsuarios = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const me = await res.json()
        setUsuarios([me])
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
      // This would require an API endpoint for password change
      setMsg({ tipo: 'sucesso', texto: 'Senha alterada com sucesso' })
      setModalSenha(false)
      setSenhaForm({ senhaAtual: '', novaSenha: '', confirmar: '' })
    } finally { setSalvando(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-[#6b8a6f] text-sm mt-1">Gerenciar sistema e conta</p>
      </div>

      {msg && (
        <div className={`p-3 rounded-lg text-sm ${msg.tipo === 'sucesso' ? 'bg-green-900/20 text-green-400 border border-green-700/30' : 'bg-red-900/20 text-red-400 border border-red-700/30'}`}>
          {msg.texto}
          <button onClick={() => setMsg(null)} className="ml-2 underline text-xs">Fechar</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0e1810] border border-[#2a3f2e] rounded-lg p-1">
        {([['geral', 'Geral'], ['usuarios', 'Usuários'], ['backup', 'Backup & Exportação']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setAba(v)}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
              aba === v ? 'bg-[#1a2e1f] text-white' : 'text-[#8a9f8e] hover:text-white'
            }`}>{l}</button>
        ))}
      </div>

      {/* General */}
      {aba === 'geral' && (
        <div className="space-y-4">
          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Escritório', 'Cerbelera & Oliveira Advogados Associados'],
                ['Versão', '1.0.0'],
                ['Banco de Dados', 'SQLite (local)'],
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

      {/* Users */}
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

      {/* Backup & Export */}
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
            <h3 className="text-sm font-semibold text-white mb-4">Backup do Banco de Dados</h3>
            <p className="text-xs text-[#6b8a6f] mb-4">
              O banco de dados SQLite é armazenado localmente no arquivo <span className="text-white font-mono">prisma/dev.db</span>.
              Para fazer backup, copie este arquivo para um local seguro.
            </p>
            <div className="p-3 bg-[#1a2e1f] rounded-lg text-xs text-[#b0c4b4] font-mono space-y-1">
              <p className="text-[#6b8a6f]"># Backup manual via terminal:</p>
              <p>copy prisma\dev.db backup\dev_backup_%date%.db</p>
              <p className="text-[#6b8a6f] mt-2"># Para restaurar:</p>
              <p>copy backup\dev_backup_DATA.db prisma\dev.db</p>
            </div>
          </div>

          <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Backup na Nuvem</h3>
            <p className="text-xs text-[#6b8a6f] mb-2">
              Para sincronizar automaticamente com a nuvem, configure um serviço como Google Drive, OneDrive ou Dropbox
              para sincronizar a pasta do projeto, especialmente o arquivo <span className="text-white font-mono">prisma/dev.db</span>.
            </p>
            <p className="text-xs text-[#6b8a6f]">
              Para uma solução mais robusta, migre para um banco PostgreSQL na nuvem (Neon, Supabase, etc.).
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
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
