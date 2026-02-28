'use client'

import { useState, useEffect, useCallback } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  endpoint: string
  searchPlaceholder?: string
  onRowClick?: (row: Record<string, unknown>) => void
  actions?: (row: Record<string, unknown>) => React.ReactNode
  filters?: React.ReactNode
  extraParams?: Record<string, string>
  dataKey?: string
}

export default function DataTable({
  columns,
  endpoint,
  searchPlaceholder = 'Buscar...',
  onRowClick,
  actions,
  filters,
  extraParams = {},
  dataKey = '',
}: DataTableProps) {
  const [dados, setDados] = useState<Record<string, unknown>[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        pagina: String(pagina),
        busca,
        ...extraParams,
      })
      const res = await fetch(`${endpoint}?${params}`)
      const data = await res.json()

      if (dataKey) {
        setDados(data[dataKey] || [])
      } else if (Array.isArray(data)) {
        setDados(data)
      } else {
        const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]))
        setDados(firstArrayKey ? data[firstArrayKey] : [])
      }
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [endpoint, pagina, busca, dataKey, extraParams])

  useEffect(() => {
    carregar()
  }, [carregar])

  const getValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, key) => {
      if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
      return undefined
    }, obj)
  }

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a2e1f] border border-[#2a3f2e] rounded-lg text-white text-sm placeholder-[#6b8a6f] focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>
        {filters}
      </div>

      {/* Table */}
      <div className="bg-[#0e1810] border border-[#2a3f2e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a3f2e]">
                {columns.map(col => (
                  <th key={col.key} className="text-left px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#8a9f8e] uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-[#6b8a6f]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : dados.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-[#6b8a6f]">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                dados.map((row, i) => (
                  <tr
                    key={String(row.id || i)}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-[#2a3f2e]/50 hover:bg-[#1a2e1f]/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-[#d0dcd2]">
                        {col.render ? col.render(getValue(row, col.key), row) : String(getValue(row, col.key) ?? '-')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a3f2e]">
            <p className="text-xs text-[#6b8a6f]">{total} registro(s)</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1 text-xs rounded-lg bg-[#1a2e1f] text-[#b0c4b4] disabled:opacity-40 hover:bg-[#2a3f2e]"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-xs text-[#8a9f8e]">Página {pagina}</span>
              <button
                onClick={() => setPagina(p => p + 1)}
                disabled={dados.length < 20}
                className="px-3 py-1 text-xs rounded-lg bg-[#1a2e1f] text-[#b0c4b4] disabled:opacity-40 hover:bg-[#2a3f2e]"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
