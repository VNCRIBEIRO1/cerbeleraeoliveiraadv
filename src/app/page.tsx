import Link from 'next/link';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import SectionHeader from '@/components/SectionHeader';
import AreaCard from '@/components/AreaCard';
import TestimonialCard from '@/components/TestimonialCard';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';

const areas = [
  {
    iconName: 'Briefcase',
    title: 'Direito Civil',
    description:
      'Orientação informativa em contratos, responsabilidade civil, direito das obrigações e questões patrimoniais.',
  },
  {
    iconName: 'Users',
    title: 'Direito Trabalhista',
    description:
      'Informações sobre relações de trabalho, direitos do trabalhador, rescisões e processos trabalhistas.',
  },
  {
    iconName: 'Heart',
    title: 'Direito de Família',
    description:
      'Orientação em divórcios, guarda de filhos, pensão alimentícia, inventários e planejamento familiar.',
  },
  {
    iconName: 'Landmark',
    title: 'Direito Previdenciário',
    description:
      'Informações sobre aposentadorias, benefícios do INSS, revisões e planejamento previdenciário.',
  },
  {
    iconName: 'ShieldCheck',
    title: 'Direito do Consumidor',
    description:
      'Orientação sobre direitos do consumidor, relações de consumo, cobranças indevidas e danos morais.',
  },
  {
    iconName: 'Building2',
    title: 'Direito Imobiliário',
    description:
      'Informações sobre compra e venda de imóveis, contratos de locação, usucapião e regularização.',
  },
];

const testimonials = [
  {
    text: 'Profissional extremamente competente e atencioso. Esclareceu todas as minhas dúvidas de forma clara e objetiva.',
    author: 'Maria S.',
    role: 'Cliente – Direito de Família',
  },
  {
    text: 'Atendimento humanizado e transparente. Senti confiança durante todo o processo de orientação.',
    author: 'João P.',
    role: 'Cliente – Direito Trabalhista',
  },
  {
    text: 'Excelente profissional. Resolveu minha questão com eficiência e sempre manteve a ética profissional.',
    author: 'Ana L.',
    role: 'Cliente – Direito Civil',
  },
];

const blogPosts = [
  {
    title: 'Seus Direitos Trabalhistas: O que Todo Trabalhador Deve Saber',
    excerpt:
      'Entenda quais são os principais direitos garantidos pela CLT e como identificar irregularidades na relação de trabalho.',
    date: '20 Fev 2026',
    readTime: '5 min',
    slug: 'direitos-trabalhistas',
    category: 'Direito Trabalhista',
  },
  {
    title: 'Guarda Compartilhada: Entenda Como Funciona',
    excerpt:
      'Saiba como funciona a guarda compartilhada, quais são os direitos dos pais e como é feita a definição.',
    date: '15 Fev 2026',
    readTime: '4 min',
    slug: 'guarda-compartilhada',
    category: 'Direito de Família',
  },
  {
    title: 'LGPD e Seus Direitos: Proteção de Dados Pessoais',
    excerpt:
      'Conheça seus direitos em relação à proteção de dados pessoais conforme a Lei Geral de Proteção de Dados.',
    date: '10 Fev 2026',
    readTime: '6 min',
    slug: 'lgpd-direitos',
    category: 'Direito Civil',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Áreas de Atuação */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Áreas de Atuação"
              title="Como Podemos Ajudar"
              subtitle="Oferecemos orientação informativa e ética em diversas áreas do Direito, sempre em conformidade com as normas da OAB."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <AreaCard
                key={area.title}
                iconName={area.iconName}
                title={area.title}
                description={area.description}
                delay={index * 0.1}
              />
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/areas-de-atuacao"
              className="btn-primary inline-flex items-center"
            >
              Ver Todas as Áreas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Sobre - Prévia */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <Scale className="w-20 h-20 text-primary-400 mx-auto mb-4" />
                    <p className="text-primary-500 font-serif text-2xl font-bold">
                      Roberto Sartoro
                    </p>
                    <p className="text-primary-400 text-sm">Advogado</p>
                  </div>
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-sm">Anos de Experiência</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="inline-block text-sm font-medium text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
                Sobre o Escritório
              </span>
              <h2 className="section-title">
                Advocacia com Ética, Transparência e Dedicação
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-6">
                O escritório Roberto Sartoro Advogado atua em Presidente
                Prudente e região, oferecendo orientação jurídica informativa e
                personalizada. Nossa missão é esclarecer dúvidas e oferecer
                caminhos dentro da legalidade, sempre com respeito às normas
                éticas da OAB.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Atendimento humanizado e personalizado',
                  'Conformidade com o Código de Ética da OAB',
                  'Transparência em todas as orientações',
                  'Compromisso com a excelência profissional',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sobre" className="btn-primary">
                Conheça Nossa História
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Anos de Experiência' },
              { number: '500+', label: 'Clientes Atendidos' },
              { number: '6', label: 'Áreas de Atuação' },
              { number: '100%', label: 'Compromisso Ético' },
            ].map((stat, index) => (
              <AnimatedSection
                key={stat.label}
                delay={index * 0.1}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  {stat.number}
                </p>
                <p className="text-primary-200 text-sm">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Depoimentos"
              title="O Que Dizem Nossos Clientes"
              subtitle="A satisfação de quem confiou em nosso trabalho é o que nos motiva a cada dia."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.author}
                text={testimonial.text}
                author={testimonial.author}
                role={testimonial.role}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog - Prévia */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeader
              badge="Blog Jurídico"
              title="Artigos Informativos"
              subtitle="Conteúdo educativo para esclarecer dúvidas jurídicas comuns, sem caráter de aconselhamento."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.slug} {...post} delay={index * 0.1} />
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/blog"
              className="btn-outline inline-flex items-center"
            >
              Ver Todos os Artigos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Precisa de Orientação Jurídica?
            </h2>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-8">
              Entre em contato conosco para uma consulta informativa. Estamos
              prontos para esclarecer suas dúvidas com ética e
              profissionalismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" className="btn-gold text-base">
                Agende uma Consulta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5518988116944'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-primary-300 text-primary-100 hover:bg-primary-100/10 hover:text-white text-base"
              >
                WhatsApp
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-primary-400 text-sm">
              <MapPin className="w-4 h-4" />
              Presidente Prudente, SP • OAB/SP 000.000
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
