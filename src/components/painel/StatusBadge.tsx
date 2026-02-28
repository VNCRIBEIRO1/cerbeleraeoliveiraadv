'use client'

const statusConfigs: Record<string, { label: string; className: string }> = {
  // Clientes
  ativo: { label: 'Ativo', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  inativo: { label: 'Inativo', className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' },
  prospecto: { label: 'Prospecto', className: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
  // Processos
  em_andamento: { label: 'Em Andamento', className: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
  concluido: { label: 'Concluído', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  arquivado: { label: 'Arquivado', className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' },
  suspenso: { label: 'Suspenso', className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50' },
  // Prazos
  pendente: { label: 'Pendente', className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50' },
  cumprido: { label: 'Cumprido', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  expirado: { label: 'Expirado', className: 'bg-red-900/50 text-red-400 border-red-700/50' },
  // Agendamentos
  agendado: { label: 'Agendado', className: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
  confirmado: { label: 'Confirmado', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  realizado: { label: 'Realizado', className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' },
  cancelado: { label: 'Cancelado', className: 'bg-red-900/50 text-red-400 border-red-700/50' },
  remarcado: { label: 'Remarcado', className: 'bg-orange-900/50 text-orange-400 border-orange-700/50' },
  // Financeiro
  pago: { label: 'Pago', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  parcial: { label: 'Parcial', className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50' },
  atrasado: { label: 'Atrasado', className: 'bg-red-900/50 text-red-400 border-red-700/50' },
  // Triagem
  nova: { label: 'Nova', className: 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30' },
  em_analise: { label: 'Em Análise', className: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
  convertida: { label: 'Convertida', className: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' },
  descartada: { label: 'Descartada', className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' },
  // Prioridade
  baixa: { label: 'Baixa', className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' },
  normal: { label: 'Normal', className: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
  alta: { label: 'Alta', className: 'bg-orange-900/50 text-orange-400 border-orange-700/50' },
  urgente: { label: 'Urgente', className: 'bg-red-900/50 text-red-400 border-red-700/50' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfigs[status] || { label: status, className: 'bg-gray-800/50 text-gray-400 border-gray-600/50' }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  )
}
