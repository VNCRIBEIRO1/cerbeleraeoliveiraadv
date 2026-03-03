import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutContent from '@/components/LayoutContent';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cerbeleraeoliveiraadv.vercel.app';
const ogImage = 'https://res.cloudinary.com/dwyrt2g1k/image/upload/f_jpg,q_85/cerbelera-oliveira/og-image';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Cerbelera & Oliveira | Advogados em Presidente Prudente - SP',
    template: '%s | Cerbelera & Oliveira Advogados',
  },
  description:
    'Cerbelera & Oliveira Advogados Associados — Escritório em Presidente Prudente, SP. Atuação ética e humanizada nas áreas de Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
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
    'advocacia Presidente Prudente',
    'consultoria jurídica',
  ],
  authors: [{ name: 'Cerbelera & Oliveira Advogados Associados' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Cerbelera & Oliveira Advogados',
    title: 'Cerbelera & Oliveira | Advogados em Presidente Prudente - SP',
    description:
      'Cerbelera & Oliveira Advogados Associados — Escritório em Presidente Prudente, SP. Atuação ética e humanizada nas áreas de Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Cerbelera & Oliveira Advogados Associados',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cerbelera & Oliveira | Advogados em Presidente Prudente - SP',
    description:
      'Escritório de Advocacia em Presidente Prudente. Atuação ética e humanizada em Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
    images: [ogImage],
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
  verification: {
    google: 'JdhatxU36ZDViOKcIKyHf89T9AhWbUJ2Va_v5Kc5yFA',
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
        <meta name="theme-color" content="#1a2e1f" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
