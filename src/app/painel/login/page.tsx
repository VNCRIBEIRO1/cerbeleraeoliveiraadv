'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [modoRegistro, setModoRegistro] = useState(false)
  const [nome, setNome] = useState('')
  const [chaveAdmin, setChaveAdmin] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao fazer login')
        return
      }

      router.push('/painel')
      router.refresh()
    } catch {
      setErro('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, chaveAdmin }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao registrar')
        return
      }

      // Após registro, fazer login automático
      setModoRegistro(false)
      setErro('')
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      router.push('/painel')
      router.refresh()
    } catch {
      setErro('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0b] via-[#111] to-[#0e1810] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#b8942e] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c9a84c]/20">
            <span className="text-white font-bold text-2xl">C&O</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Cerbelera & Oliveira</h1>
          <p className="text-[#6b8a6f] text-sm mt-1">Painel de Gestão Jurídica</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">
            {modoRegistro ? 'Criar Conta de Acesso' : 'Acessar Painel'}
          </h2>

          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-400 text-sm">
              {erro}
            </div>
          )}

          <form onSubmit={modoRegistro ? handleRegistro : handleLogin} className="space-y-4">
            {modoRegistro && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#b0c4b4] mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="Dr(a). Nome Completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#b0c4b4] mb-1.5">Chave de Administrador</label>
                  <input
                    type="password"
                    value={chaveAdmin}
                    onChange={(e) => setChaveAdmin(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="Chave de segurança"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#b0c4b4] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b0c4b4] mb-1.5">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white font-medium text-sm hover:from-[#d4b55a] hover:to-[#c9a84c] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-[#c9a84c]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </span>
              ) : modoRegistro ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setModoRegistro(!modoRegistro); setErro('') }}
              className="text-sm text-[#c9a84c] hover:text-[#d4b55a] transition-colors"
            >
              {modoRegistro ? 'Já tenho conta - Fazer login' : 'Primeiro acesso - Criar conta'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#4a5f4e] mt-6">
          Sistema restrito. Acesso apenas para membros autorizados.
        </p>
      </div>
    </div>
  )
}
