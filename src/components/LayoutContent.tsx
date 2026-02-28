'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import ChatBot from './ChatBot'
import WhatsAppButton from './WhatsAppButton'
import CookieBanner from './CookieBanner'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPainel = pathname.startsWith('/painel')

  if (isPainel) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBot />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
