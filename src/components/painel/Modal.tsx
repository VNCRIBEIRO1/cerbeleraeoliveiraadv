'use client'

import { useState, useEffect } from 'react'

interface ModalProps {
  aberto: boolean
  onFechar: () => void
  titulo: string
  children: React.ReactNode
  tamanho?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ aberto, onFechar, titulo, children, tamanho = 'md' }: ModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (aberto) {
      setShow(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setTimeout(() => setShow(false), 200)
    }
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  if (!show && !aberto) return null

  const tamanhos = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${aberto ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70" onClick={onFechar} />
      <div className={`relative bg-[#0e1810] border border-[#2a3f2e] rounded-xl w-full ${tamanhos[tamanho]} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0e1810] border-b border-[#2a3f2e] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-white">{titulo}</h2>
          <button onClick={onFechar} className="p-1 rounded-lg text-[#6b8a6f] hover:text-white hover:bg-[#2a3f2e] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Componentes auxiliares para formulários dentro do modal
export function FormField({ label, children, obrigatorio = false }: { label: string; children: React.ReactNode; obrigatorio?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#b0c4b4] mb-1.5">
        {label}
        {obrigatorio && <span className="text-[#c9a84c] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

export function FormInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50 ${props.className || ''}`}
    />
  )
}

export function FormSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 ${props.className || ''}`}
    >
      {children}
    </select>
  )
}

export function FormTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50 resize-none ${props.className || ''}`}
    />
  )
}

export function FormButton({ variant = 'primary', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const estilos = {
    primary: 'bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white hover:from-[#d4b55a] hover:to-[#c9a84c]',
    secondary: 'bg-[#1a2e1f] text-[#b0c4b4] border border-[#2a3f2e] hover:bg-[#2a3f2e]',
    danger: 'bg-red-900/50 text-red-400 border border-red-800/50 hover:bg-red-900/70',
  }

  return (
    <button
      {...props}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 ${estilos[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  )
}
