import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatBot from '@/components/ChatBot';
import CookieBanner from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cerbeleraeoliveiraadv.vercel.app'
  ),
  title: {
    default:
      'Cerbelera & Oliveira | Advogados em Presidente Prudente - SP',
    template: '%s | Cerbelera & Oliveira Advogados',
  },
  description:
    'Cerbelera & Oliveira Advogados Associados – Escritório de Advocacia em Presidente Prudente, SP. Atuação estratégica e humanizada em Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
  keywords: [
    'advogado Presidente Prudente',
    'escritório de advocacia',
    'direito trabalhista',
    'direito criminal',
    'direito civil',
    'direito empresarial',
    'direito administrativo',
    'Cerbelera Oliveira',
    'advogado SP',
  ],
  authors: [{ name: 'Cerbelera & Oliveira Advogados Associados' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cerbelera & Oliveira Advogados',
    title: 'Cerbelera & Oliveira | Advogados em Presidente Prudente - SP',
    description:
      'Escritório de Advocacia em Presidente Prudente. Atuação estratégica e humanizada em Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
        <WhatsAppButton />
        <CookieBanner />
      </body>
    </html>
  );
}
