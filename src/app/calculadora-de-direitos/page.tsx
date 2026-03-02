import type { Metadata } from 'next';
import CalculadoraClient from './CalculadoraClient';

export const metadata: Metadata = {
  title: 'Calculadora de Direitos Trabalhistas | Insalubridade e Periculosidade | Advogado em Presidente Prudente',
  description:
    'Descubra gratuitamente se você tem direito a adicional de insalubridade ou periculosidade. Calculadora online do escritório Cerbelera & Oliveira Advogados em Presidente Prudente/SP. Me. Diogo Cerbelera, Mestre em Direito.',
  keywords: [
    'calculadora direitos trabalhistas',
    'insalubridade',
    'periculosidade',
    'adicional insalubridade',
    'adicional periculosidade',
    'direitos trabalhistas',
    'advogado trabalhista Presidente Prudente',
    'advogado em Presidente Prudente',
    'advogado Presidente Prudente SP',
    'direito trabalhista Presidente Prudente',
    'escritório advocacia Presidente Prudente',
    'EPI',
    'NR-15',
    'NR-16',
    'Cerbelera Oliveira advogados',
  ],
  openGraph: {
    title: 'Calculadora de Direitos Trabalhistas — Você Tem Direito?',
    description:
      'Verifique gratuitamente se você tem direito a adicionais de insalubridade ou periculosidade. Advogado especialista em Presidente Prudente/SP.',
    type: 'website',
    url: '/calculadora-de-direitos',
  },
  alternates: {
    canonical: '/calculadora-de-direitos',
  },
};

// Schema.org structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de Direitos Trabalhistas',
  description:
    'Ferramenta gratuita para verificar direitos a adicionais de insalubridade e periculosidade',
  url: 'https://cerbeleraeoliveiraadv.vercel.app/calculadora-de-direitos',
  applicationCategory: 'LegalService',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
  },
  provider: {
    '@type': 'LegalService',
    name: 'Cerbelera & Oliveira Advogados Associados',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. Francisco Machado de Campos, 393',
      addressLocality: 'Presidente Prudente',
      addressRegion: 'SP',
      postalCode: '19010-300',
      addressCountry: 'BR',
    },
    telephone: '+551899610-1884',
    url: 'https://cerbeleraeoliveiraadv.vercel.app',
  },
};

export default function CalculadoraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculadoraClient />
    </>
  );
}
