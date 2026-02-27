'use client';

import Image from 'next/image';
import {
  Scale,
  GraduationCap,
  Award,
  Target,
  Heart,
  CheckCircle2,
  BookOpen,
  Star,
  LucideIcon,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

const valores: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Scale,
    title: 'Ética',
    desc: 'Atuação estritamente conforme o Código de Ética da OAB e o Provimento 205/2021.',
  },
  {
    icon: Heart,
    title: 'Humanização',
    desc: 'Cada cliente é tratado com empatia, respeito e atenção individualizada.',
  },
  {
    icon: Target,
    title: 'Estratégia',
    desc: 'Análise detalhada de cada caso para traçar a melhor estratégia de defesa dos seus direitos.',
  },
  {
    icon: Award,
    title: 'Excelência',
    desc: 'Busca constante por atualização e aprimoramento profissional. 5.0 de avaliação no Google.',
  },
];

const formacao = [
  {
    year: '2019',
    title: 'Graduação em Direito',
    institution: 'Universidade do Oeste Paulista - UNOESTE',
  },
  {
    year: '2020',
    title: 'Aprovação na OAB',
    institution: 'Ordem dos Advogados do Brasil - Seccional SP',
  },
  {
    year: '2021',
    title: 'Fundação do Escritório',
    institution: 'Cerbelera & Oliveira Advogados Associados',
  },
  {
    year: '2023',
    title: 'Especialização Continuada',
    institution: 'Direito Trabalhista e Criminal',
  },
];

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Sobre o Escritório
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Conheça o Escritório <br />
              <span className="text-gold-400">Cerbelera & Oliveira</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl">
              Mais de 5 anos de atuação estratégica e humanizada na defesa dos
              seus direitos em Presidente Prudente e região.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src={IMAGES.lawyer}
                    alt="Sócios Diogo Cerbelera e Luã Oliveira - Advogados"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-sm font-medium">5.0 no Google</p>
                  <p className="text-xs opacity-80">12+ avaliações</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="section-title">Nossa História</h2>
              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  O escritório Cerbelera & Oliveira Advogados Associados nasceu
                  da união de dois profissionais apaixonados pelo Direito —
                  <strong> Diogo Ramos Cerbelera Neto</strong> e
                  <strong> Luã Carlos de Oliveira</strong> — comprometidos com a
                  justiça e a defesa dos direitos dos cidadãos.
                </p>
                <p>
                  Ao longo de mais de 5 anos de atuação, construímos uma
                  trajetória sólida baseada na ética, transparência e no
                  compromisso inabalável com cada pessoa que nos procura.
                </p>
                <p>
                  Nossa atuação é pautada pelo Código de Ética e Disciplina da
                  OAB, pelo Provimento 205/2021 e pela convicção de que o acesso
                  à informação jurídica é um direito de todos.
                </p>
                <p>
                  Contamos com estacionamento próprio e um ambiente acolhedor
                  para que nossos clientes se sintam confortáveis durante todo o
                  processo de atendimento. Nosso escritório está localizado na
                  R. Francisco Machado de Campos, 393 - Vila Nova, Presidente
                  Prudente/SP.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Nossos Valores"
              title="Princípios que Nos Guiam"
              subtitle="Cada ação do escritório é guiada por valores sólidos que refletem nosso compromisso com a sociedade."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => {
              const Icon = valor.icon;
              return (
                <AnimatedSection key={valor.title} delay={index * 0.1}>
                  <div className="card p-8 text-center h-full border border-secondary-100">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary-500 mb-3">
                      {valor.title}
                    </h3>
                    <p className="text-secondary-600 text-sm">{valor.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formação */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Trajetória"
              title="Nossa Caminhada"
              subtitle="Uma trajetória construída com dedicação, estudo e compromisso com a justiça."
            />
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            {formacao.map((item, index) => (
              <AnimatedSection key={item.year} delay={index * 0.1}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    {index < formacao.length - 1 && (
                      <div className="w-0.5 flex-1 bg-primary-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="inline-block text-xs font-bold text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-primary-500">
                      {item.title}
                    </h3>
                    <p className="text-secondary-500 text-sm">
                      {item.institution}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Compromissos OAB */}
      <section className="py-20 bg-primary-500">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              light
              badge="Compromisso Ético"
              title="Em Conformidade com a OAB"
              subtitle="Todo o nosso trabalho respeita rigorosamente as normas éticas da Ordem dos Advogados do Brasil."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Conteúdo meramente informativo, sem promessas de resultados',
              'Respeito ao sigilo profissional e à confidencialidade',
              'Conformidade com o Provimento 205/2021 da OAB',
              'Atendimento ético sem captação indevida de clientes',
              'Transparência em honorários e procedimentos',
              'Conformidade com a LGPD para proteção de dados',
            ].map((item, index) => (
              <AnimatedSection key={item} delay={index * 0.05}>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom text-center">
          <AnimatedSection>
            <BookOpen className="w-12 h-12 text-primary-300 mx-auto mb-6" />
            <h2 className="section-title">Quer Saber Mais?</h2>
            <p className="section-subtitle mx-auto mb-8">
              Entre em contato para uma consulta ou visite nosso blog para
              conteúdo jurídico educativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" className="btn-primary">
                Fale Conosco
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/blog" className="btn-outline">
                Acessar o Blog
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
