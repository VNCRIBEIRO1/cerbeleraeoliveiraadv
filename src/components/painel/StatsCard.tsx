'use client'

interface StatsCardProps {
  titulo: string
  valor: string | number
  subtitulo?: string
  cor?: 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'orange'
  icon: string
}

const cores = {
  gold: 'from-[#c9a84c]/20 to-[#b8942e]/10 border-[#c9a84c]/30 text-[#c9a84c]',
  green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
}

export default function StatsCard({ titulo, valor, subtitulo, cor = 'gold', icon }: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${cores[cor]} border rounded-xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#8a9f8e] text-sm font-medium">{titulo}</p>
          <p className="text-2xl font-bold text-white mt-1">{valor}</p>
          {subtitulo && <p className="text-xs text-[#6b8a6f] mt-1">{subtitulo}</p>}
        </div>
        <div className={`p-2.5 rounded-lg bg-black/20`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  )
}
