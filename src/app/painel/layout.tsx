import type { Metadata } from 'next'
import Sidebar from '@/components/painel/Sidebar'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Painel de Gestão | Cerbelera & Oliveira Advogados',
  description: 'Sistema de gestão jurídica',
  robots: { index: false, follow: false },
}

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('painel_token')?.value
  const isLoginPage = !token

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b] flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
