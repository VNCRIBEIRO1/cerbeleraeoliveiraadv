'use client';

import Link from 'next/link';
import {
  Briefcase,
  Users,
  Heart,
  Landmark,
  ShieldCheck,
  Building2,
  Scale,
  ArrowRight,
  CheckCircle2,
  FileText,
  Gavel,
  Handshake,
  LucideIcon,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeader from '@/components/SectionHeader';
import AreaIllustration from '@/components/illustrations/AreaIllustration';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Users,
  Heart,
  Landmark,
  ShieldCheck,
  Building2,
  FileText,
  Handshake,
  Scale,
};

const areas = [
  {
    iconName: 'Briefcase',
    title: 'Direito Civil',
    description:
      'Orientação informativa em questões civis como contratos, responsabilidade civil, indenizações e direitos das obrigações.',
    topics: [
      'Contratos e Obrigações',
      'Responsabilidade Civil',
      'Indenizações por Danos',
      'Direito das Sucessões',
      'Cobranças e Execuções',
      'Ações de Reparação',
    ],
    color: 'from-blue-500 to-blue-700',
  },
  {
    iconName: 'Users',
    title: 'Direito Trabalhista',
    description:
      'Informações sobre relações de trabalho, direitos do trabalhador e empregador, rescisões contratuais e processos trabalhistas.',
    topics: [
      'Rescisão Contratual',
      'Verbas Rescisórias',
      'Assédio Moral e Sexual',
      'Horas Extras e Adicionais',
      'Acidentes de Trabalho',
      'Direitos do Empregado',
    ],
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    iconName: 'Heart',
    title: 'Direito de Família',
    description:
      'Orientação em questões familiares como divórcio, guarda de filhos, pensão alimentícia, inventários e planejamento familiar.',
    topics: [
      'Divórcio e Separação',
      'Guarda de Filhos',
      'Pensão Alimentícia',
      'Inventários e Partilha',
      'União Estável',
      'Adoção',
    ],
    color: 'from-rose-500 to-rose-700',
  },
  {
    iconName: 'Landmark',
    title: 'Direito Previdenciário',
    description:
      'Informações sobre aposentadorias, benefícios do INSS, revisões de benefícios e planejamento previdenciário.',
    topics: [
      'Aposentadoria por Idade',
      'Aposentadoria por Tempo',
      'Auxílio-Doença',
      'BPC/LOAS',
      'Revisão de Benefícios',
      'Pensão por Morte',
    ],
    color: 'from-amber-500 to-amber-700',
  },
  {
    iconName: 'ShieldCheck',
    title: 'Direito do Consumidor',
    description:
      'Orientação sobre direitos do consumidor, relações de consumo, cobranças indevidas, negativação e danos morais.',
    topics: [
      'Cobranças Indevidas',
      'Negativação Indevida',
      'Vícios de Produto',
      'Propaganda Enganosa',
      'Danos Morais',
      'Direito de Arrependimento',
    ],
    color: 'from-purple-500 to-purple-700',
  },
  {
    iconName: 'Building2',
    title: 'Direito Imobiliário',
    description:
      'Informações sobre compra e venda de imóveis, contratos de locação, usucapião, regularização fundiária e disputas possessórias.',
    topics: [
      'Compra e Venda',
      'Contratos de Locação',
      'Usucapião',
      'Regularização Fundiária',
      'Disputas Possessórias',
      'Condomínios',
    ],
    color: 'from-cyan-500 to-cyan-700',
  },
];

export default function AreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gavel className="w-4 h-4" />
              Áreas de Atuação
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Nossas <span className="text-gold-400">Áreas de Atuação</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl">
              Oferecemos orientação informativa e ética em diversas áreas do
              Direito, sempre em conformidade com as normas da OAB.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Áreas detalhadas */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="space-y-20">
            {areas.map((area, index) => {
              const AreaIcon = iconMap[area.iconName] || Briefcase;
              return (
              <AnimatedSection key={area.title}>
                <div
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center`}
                      >
                        <AreaIcon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-500">
                        {area.title}
                      </h2>
                    </div>

                    <p className="text-secondary-600 leading-relaxed mb-8">
                      {area.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {area.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                          <span className="text-secondary-700 text-sm">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/contato"
                      className="btn-primary inline-flex items-center text-sm"
                    >
                      Saiba Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <AreaIllustration
                      areaName={area.title}
                      colorFrom={area.color.split(' ')[0]}
                      colorTo={area.color.split(' ')[1]}
                      className="aspect-[4/3] rounded-2xl shadow-lg"
                    />
                  </div>
                </div>

                {index < areas.length - 1 && (
                  <div className="border-b border-secondary-200 mt-20" />
                )}
              </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Law Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Visual Law"
              title="Direito de Forma Acessível"
              subtitle="Utilizamos recursos visuais para tornar conceitos jurídicos mais claros e acessíveis a todos."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                iconName: 'FileText',
                title: 'Documentos Visuais',
                desc: 'Contratos e petições com recursos gráficos para melhor compreensão.',
              },
              {
                iconName: 'Handshake',
                title: 'Fluxogramas',
                desc: 'Visualização clara dos processos e procedimentos jurídicos.',
              },
              {
                iconName: 'Scale',
                title: 'Infográficos',
                desc: 'Informações jurídicas apresentadas de forma visual e didática.',
              },
            ].map((item, index) => {
              const Icon = iconMap[item.iconName] || Briefcase;
              return (
              <AnimatedSection key={item.title} delay={index * 0.1}>
                <div className="card p-8 text-center h-full border border-secondary-100">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Precisa de Orientação?
            </h2>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-8">
              Entre em contato para esclarecer suas dúvidas. Nosso atendimento é
              informativo e segue as normas éticas da OAB.
            </p>
            <Link href="/contato" className="btn-gold text-base">
              Agende uma Consulta Informativa
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
