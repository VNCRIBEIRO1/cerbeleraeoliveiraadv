'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ModalProps {
  aberto: boolean
  onFechar: () => void
  titulo: string
  children: React.ReactNode
  tamanho?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ aberto, onFechar, titulo, children, tamanho = 'md' }: ModalProps) {
  const [show, setShow] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onFechar()
  }, [onFechar])

  useEffect(() => {
    if (aberto) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setShow(true)
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
      // Focus trap: focus the modal after render
      setTimeout(() => modalRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
      setTimeout(() => setShow(false), 200)
      // Restore previous focus
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [aberto, handleEscape])

  // Focus trap: keep tab inside the modal
  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  }

  if (!show && !aberto) return null

  const tamanhos = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${aberto ? 'opacity-100' : 'opacity-0'}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/70" onClick={onFechar} />
      <div ref={modalRef} onKeyDown={handleTab} tabIndex={-1} className={`relative bg-[#0e1810] border border-[#1e3323] rounded-2xl w-full ${tamanhos[tamanho]} max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 outline-none`}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0e1810] border-b border-[#1e3323] px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 id="modal-title" className="text-lg font-semibold text-white tracking-tight">{titulo}</h2>
          <button onClick={onFechar} className="p-1.5 rounded-xl text-[#5a7b5e] hover:text-white hover:bg-[#1a2e1f] transition-colors" aria-label="Fechar modal">
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
      <label className="block text-sm font-semibold text-[#b0c4b4] mb-1.5">
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
      className={`w-full px-3.5 py-2.5 bg-[#111a13] border border-[#1e3323] rounded-xl text-white text-sm placeholder-[#4a6b4e] focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all ${props.className || ''}`}
    />
  )
}

export function FormSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 bg-[#111a13] border border-[#1e3323] rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all ${props.className || ''}`}
    >
      {children}
    </select>
  )
}

export function FormTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 bg-[#111a13] border border-[#1e3323] rounded-xl text-white text-sm placeholder-[#4a6b4e] focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 resize-none transition-all ${props.className || ''}`}
    />
  )
}

export function FormButton({ variant = 'primary', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const estilos = {
    primary: 'bg-gradient-to-r from-[#c9a84c] to-[#b8942e] text-white hover:from-[#d4b55a] hover:to-[#c9a84c] shadow-lg shadow-[#c9a84c]/15',
    secondary: 'bg-[#111a13] text-[#b0c4b4] border border-[#1e3323] hover:bg-[#1a2e1f]',
    danger: 'bg-red-950/50 text-red-400 border border-red-800/30 hover:bg-red-950/70',
  }

  return (
    <button
      {...props}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 active:scale-[0.98] ${estilos[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  )
}
