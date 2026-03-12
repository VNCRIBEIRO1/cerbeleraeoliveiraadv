import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutContent from '@/components/LayoutContent';
import ConditionalAnalytics from '@/components/ConditionalAnalytics';

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
    // === Busca principal — advogado + cidade ===
    'advogado Presidente Prudente',
    'advogado em Presidente Prudente',
    'advogados Presidente Prudente',
    'advogados em Presidente Prudente',
    'advogado Presidente Prudente SP',
    'adv Presidente Prudente',
    'adv pres prudente',
    'advogado pres prudente',
    'escritório de advocacia Presidente Prudente',
    'escritório advocacia Presidente Prudente',
    'escritório de advocacia em Presidente Prudente',
    'escritório advocacia pres prudente',
    'melhor advogado Presidente Prudente',
    'melhor escritório de advocacia Presidente Prudente',
    'advogado bom Presidente Prudente',
    'advogado recomendado Presidente Prudente',
    'advogado de confiança Presidente Prudente',
    'advogado conceituado Presidente Prudente',
    'advogado renomado Presidente Prudente',
    'advogado mestre em direito Presidente Prudente',
    'advogado OAB SP Presidente Prudente',
    // === Direito Trabalhista ===
    'advogado trabalhista Presidente Prudente',
    'advogado trabalhista em Presidente Prudente',
    'advogado trabalhista pres prudente',
    'advogado do trabalho Presidente Prudente',
    'advogado direito do trabalho Presidente Prudente',
    'escritório trabalhista Presidente Prudente',
    'escritório direito trabalhista Presidente Prudente',
    'escritório de advocacia trabalhista Presidente Prudente',
    'advogado trabalhista',
    'direito trabalhista Presidente Prudente',
    'reclamação trabalhista Presidente Prudente',
    'processo trabalhista Presidente Prudente',
    'ação trabalhista Presidente Prudente',
    'rescisão trabalhista advogado',
    'horas extras advogado',
    'assédio moral trabalho advogado',
    'acidente de trabalho advogado Presidente Prudente',
    'demissão justa causa advogado',
    'FGTS advogado',
    'verbas rescisórias advogado',
    'insalubridade periculosidade advogado',
    // === Direito Criminal ===
    'advogado criminalista Presidente Prudente',
    'advogado criminalista em Presidente Prudente',
    'advogado criminalista pres prudente',
    'advogado criminal Presidente Prudente',
    'advogado penal Presidente Prudente',
    'advogado direito penal Presidente Prudente',
    'escritório criminal Presidente Prudente',
    'escritório criminalista Presidente Prudente',
    'escritório direito criminal Presidente Prudente',
    'advogado criminalista',
    'direito criminal Presidente Prudente',
    'habeas corpus advogado Presidente Prudente',
    'defesa criminal Presidente Prudente',
    'audiência de custódia advogado',
    'advogado para preso Presidente Prudente',
    // === Direito Civil ===
    'advogado cível Presidente Prudente',
    'advogado civil Presidente Prudente',
    'advogado cível em Presidente Prudente',
    'advogado direito civil Presidente Prudente',
    'escritório cível Presidente Prudente',
    'escritório direito civil Presidente Prudente',
    'advogado indenização Presidente Prudente',
    'advogado danos morais Presidente Prudente',
    'advogado contratos Presidente Prudente',
    'advogado responsabilidade civil',
    'ação de indenização advogado',
    'danos morais advogado Presidente Prudente',
    'danos materiais advogado',
    // === Direito Empresarial ===
    'advogado empresarial Presidente Prudente',
    'advogado empresarial em Presidente Prudente',
    'advogado direito empresarial Presidente Prudente',
    'assessoria jurídica empresarial Presidente Prudente',
    'escritório empresarial Presidente Prudente',
    'advogado para empresas Presidente Prudente',
    'advogado societário Presidente Prudente',
    'recuperação judicial advogado Presidente Prudente',
    'contrato empresarial advogado',
    'advogado compliance Presidente Prudente',
    'advogado empresa Presidente Prudente',
    // === Direito Administrativo ===
    'advogado administrativo Presidente Prudente',
    'advogado direito administrativo Presidente Prudente',
    'advogado licitação Presidente Prudente',
    'advogado licitações Presidente Prudente',
    'advogado concurso público Presidente Prudente',
    'mandado de segurança advogado Presidente Prudente',
    'advogado administrativista Presidente Prudente',
    'advogado contra o estado',
    'escritório direito administrativo Presidente Prudente',
    // === Cálculos Judiciais ===
    'cálculos judiciais Presidente Prudente',
    'perito calculista Presidente Prudente',
    'liquidação de sentença advogado',
    'cálculos trabalhistas advogado',
    'atualização débitos judiciais',
    'calculadora direitos trabalhistas',
    'insalubridade periculosidade',
    // === Cidades da região ===
    'advogado Álvares Machado',
    'advogado Regente Feijó',
    'advogado Pirapozinho',
    'advogado Martinópolis',
    'advogado Presidente Bernardes',
    'advogado Presidente Venceslau',
    'advogado Dracena',
    'advogado Presidente Epitácio',
    'advogado oeste paulista',
    'advogado interior SP',
    'advogado região de Presidente Prudente',
    // === Marca ===
    'Cerbelera Oliveira',
    'Cerbelera e Oliveira advogados',
    'Cerbelera & Oliveira',
    'Diogo Cerbelera advogado',
    'Luã Oliveira advogado',
    // === Termos genéricos com alto volume ===
    'consultoria jurídica',
    'assessoria jurídica',
    'consulta advogado',
    'agendar consulta advogado',
    'advogado online',
    'advogado SP',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // === Organization ===
      {
        '@type': 'LegalService',
        '@id': `${siteUrl}/#organization`,
        name: 'Cerbelera & Oliveira Advogados Associados',
        alternateName: ['Cerbelera e Oliveira Advogados', 'Escritório Cerbelera Oliveira', 'Cerbelera & Oliveira', 'Escritório de Advocacia Cerbelera'],
        url: siteUrl,
        logo: ogImage,
        image: ogImage,
        description: 'Escritório de advocacia em Presidente Prudente, SP. Atuação estratégica e humanizada em Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo. Liderado pelo Me. Diogo Ramos Cerbelera Neto, Mestre em Direito.',
        telephone: '+55-18-99610-1884',
        email: 'contato@cerbeleraoliveira.adv.br',
        foundingDate: '2021',
        priceRange: '$$',
        currenciesAccepted: 'BRL',
        paymentAccepted: 'Dinheiro, Cartão, PIX, Transferência',
        areaServed: [
          { '@type': 'City', name: 'Presidente Prudente', '@id': 'https://www.wikidata.org/wiki/Q376633' },
          { '@type': 'State', name: 'São Paulo' },
          { '@type': 'City', name: 'Álvares Machado' },
          { '@type': 'City', name: 'Regente Feijó' },
          { '@type': 'City', name: 'Pirapozinho' },
          { '@type': 'City', name: 'Martinópolis' },
          { '@type': 'City', name: 'Presidente Bernardes' },
          { '@type': 'City', name: 'Presidente Venceslau' },
          { '@type': 'City', name: 'Dracena' },
          { '@type': 'City', name: 'Presidente Epitácio' },
          { '@type': 'City', name: 'Assis' },
          { '@type': 'City', name: 'Marília' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços Jurídicos',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direito Trabalhista', description: 'Defesa em reclamações trabalhistas, rescisões, assédio moral, horas extras, acidentes de trabalho' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direito Criminal', description: 'Defesas criminais, habeas corpus, audiências de custódia, recursos criminais' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direito Civil', description: 'Contratos, responsabilidade civil, indenizações, cobranças, reparação de danos' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direito Empresarial', description: 'Assessoria jurídica empresarial, contratos comerciais, recuperação judicial, falência' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direito Administrativo', description: 'Licitações, contratos administrativos, concursos públicos, mandados de segurança' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cálculos Judiciais', description: 'Liquidação de sentenças, atualização de débitos, perícias contábeis' } },
          ],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'R. Francisco Machado de Campos, 393',
          addressLocality: 'Presidente Prudente',
          addressRegion: 'SP',
          postalCode: '19010-300',
          addressCountry: 'BR',
          name: 'Cerbelera & Oliveira Advogados - Presidente Prudente',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -22.1256,
          longitude: -51.3889,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00',
          },
        ],
        sameAs: [],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '38',
          reviewCount: '38',
        },
        member: [
          {
            '@type': 'Person',
            name: 'Me. Diogo Ramos Cerbelera Neto',
            jobTitle: 'Advogado — Mestre em Direito',
            description: 'Mestre em Direito pela Universidade, advogado atuante em Presidente Prudente/SP com foco em Direito Trabalhista, Criminal e Civil.',
            memberOf: { '@type': 'Organization', name: 'OAB — Ordem dos Advogados do Brasil, Seccional SP' },
          },
          {
            '@type': 'Person',
            name: 'Luã Carlos de Oliveira',
            jobTitle: 'Advogado',
            description: 'Advogado atuante em Presidente Prudente/SP com foco em Direito Empresarial, Administrativo e Cálculos Judiciais.',
            memberOf: { '@type': 'Organization', name: 'OAB — Ordem dos Advogados do Brasil, Seccional SP' },
          },
        ],
      },
      // === WebSite ===
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Cerbelera & Oliveira Advogados',
        description: 'Escritório de Advocacia em Presidente Prudente — Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      // === BreadcrumbList ===
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Sobre', item: `${siteUrl}/sobre` },
          { '@type': 'ListItem', position: 3, name: 'Áreas de Atuação', item: `${siteUrl}/areas-de-atuacao` },
          { '@type': 'ListItem', position: 4, name: 'Blog Jurídico', item: `${siteUrl}/blog` },
          { '@type': 'ListItem', position: 5, name: 'Contato', item: `${siteUrl}/contato` },
          { '@type': 'ListItem', position: 6, name: 'Agendamento', item: `${siteUrl}/agendamento` },
          { '@type': 'ListItem', position: 7, name: 'Calculadora de Direitos', item: `${siteUrl}/calculadora-de-direitos` },
        ],
      },
      // === FAQPage — perguntas frequentes para aparecer no Google ===
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'O que considerar ao escolher um escritório de advocacia em Presidente Prudente?',
            acceptedAnswer: { '@type': 'Answer', text: 'Ao escolher um escritório de advocacia, considere a experiência dos profissionais, áreas de atuação, avaliações de clientes e conformidade com a OAB. O escritório Cerbelera & Oliveira atua em Presidente Prudente com Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo, liderado pelo Me. Diogo Cerbelera, Mestre em Direito.' },
          },
          {
            '@type': 'Question',
            name: 'Quanto custa uma consulta com advogado em Presidente Prudente?',
            acceptedAnswer: { '@type': 'Answer', text: 'O valor da consulta pode variar conforme a complexidade do caso e a área de atuação. O escritório Cerbelera & Oliveira oferece atendimento personalizado. Entre em contato pelo WhatsApp (18) 99610-1884 para agendar.' },
          },
          {
            '@type': 'Question',
            name: 'Como encontrar um advogado trabalhista em Presidente Prudente?',
            acceptedAnswer: { '@type': 'Answer', text: 'O escritório Cerbelera & Oliveira é especializado em Direito Trabalhista em Presidente Prudente. Atua em reclamações trabalhistas, rescisões, assédio moral, horas extras, acidentes de trabalho e todas as demandas laborais.' },
          },
          {
            '@type': 'Question',
            name: 'Preciso de um advogado criminalista em Presidente Prudente. Onde encontrar?',
            acceptedAnswer: { '@type': 'Answer', text: 'O escritório Cerbelera & Oliveira atua com defesa criminal robusta, habeas corpus, audiências de custódia e recursos criminais em Presidente Prudente e região. Contato: (18) 99610-1884.' },
          },
          {
            '@type': 'Question',
            name: 'O que faz um advogado empresarial em Presidente Prudente?',
            acceptedAnswer: { '@type': 'Answer', text: 'Um advogado empresarial auxilia na constituição de empresas, elaboração de contratos comerciais, recuperação judicial, compliance e questões societárias. O escritório Cerbelera & Oliveira oferece assessoria jurídica empresarial completa em Presidente Prudente.' },
          },
          {
            '@type': 'Question',
            name: 'Quais os direitos do trabalhador demitido por justa causa?',
            acceptedAnswer: { '@type': 'Answer', text: 'Na demissão por justa causa, o trabalhador perde aviso prévio, multa de 40% do FGTS, saque do FGTS e seguro-desemprego. Mantém saldo de salário e férias vencidas. Se a justa causa for indevida, pode ser revertida judicialmente. Consulte um advogado trabalhista.' },
          },
          {
            '@type': 'Question',
            name: 'Como funciona o habeas corpus?',
            acceptedAnswer: { '@type': 'Answer', text: 'O habeas corpus é um remédio constitucional que protege o direito de liberdade contra prisão ilegal ou abuso de poder. Pode ser impetrado por qualquer pessoa, é gratuito e tem tramitação prioritária. Procure um advogado criminalista para orientação.' },
          },
          {
            '@type': 'Question',
            name: 'O escritório atende em quais cidades além de Presidente Prudente?',
            acceptedAnswer: { '@type': 'Answer', text: 'O escritório Cerbelera & Oliveira atende Presidente Prudente e toda a região, incluindo Álvares Machado, Regente Feijó, Pirapozinho, Martinópolis, Presidente Bernardes, Presidente Venceslau, Dracena, Presidente Epitácio e demais cidades do Oeste Paulista.' },
          },
        ],
      },
    ],
  };

  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <meta name="theme-color" content="#1a2e1f" />
        <meta name="geo.region" content="BR-SP" />
        <meta name="geo.placename" content="Presidente Prudente" />
        <meta name="geo.position" content="-22.1256;-51.3889" />
        <meta name="ICBM" content="-22.1256, -51.3889" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <LayoutContent>{children}</LayoutContent>
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
