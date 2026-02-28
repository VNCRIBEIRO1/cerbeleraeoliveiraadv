import type { Metadata } from 'next'
import Sidebar from '@/components/painel/Sidebar'

export const metadata: Metadata = {
  title: 'Painel de Gestão | Cerbelera & Oliveira Advogados',
  description: 'Sistema de gestão jurídica',
  robots: { index: false, follow: false },
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111] flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
