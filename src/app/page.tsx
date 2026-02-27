import Link from 'next/link';
import Image from 'next/image';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import SectionHeader from '@/components/SectionHeader';
import AreaCard from '@/components/AreaCard';
import TestimonialCard from '@/components/TestimonialCard';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';
import { IMAGES } from '@/lib/images';

const areas = [
  {
    iconName: 'Users',
    title: 'Direito Trabalhista',
    description:
      'Defesa estratégica em reclamações trabalhistas, rescisões, assédio moral, horas extras, acidentes de trabalho e demais questões laborais.',
  },
  {
    iconName: 'ShieldCheck',
    title: 'Direito Criminal',
    description:
      'Atuação em defesas criminais, habeas corpus, audiências de custódia, recursos e acompanhamento processual completo.',
  },
  {
    iconName: 'Briefcase',
    title: 'Direito Civil',
    description:
      'Orientação em contratos, responsabilidade civil, indenizações, cobranças, ações de reparação e direito das obrigações.',
  },
  {
    iconName: 'Building2',
    title: 'Direito Empresarial',
    description:
      'Assessoria jurídica para empresas, contratos comerciais, recuperação judicial, falência e questões societárias.',
  },
  {
    iconName: 'Landmark',
    title: 'Direito Administrativo',
    description:
      'Atuação em licitações, contratos administrativos, concursos públicos, mandados de segurança e processos disciplinares.',
  },
  {
    iconName: 'Scale',
    title: 'Cálculos Judiciais',
    description:
      'Elaboração e conferência de cálculos judiciais, liquidação de sentenças, atualização de débitos e perícias contábeis.',
  },
];

const testimonials = [
  {
    text: 'Atendimento excelente, super bem localizado e com estacionamento próprio. Esclareceram todas as minhas dúvidas com muita paciência e profissionalismo.',
    author: 'Andresa Louzada',
    role: 'Cliente',
  },
  {
    text: 'Excelência no atendimento, profissionalismo, qualidade e confiança. Altamente recomendado para quem procura serviços jurídicos confiáveis.',
    author: 'Raquel Martin Louzada',
    role: 'Cliente',
  },
  {
    text: 'Muito esclarecedor. Prestaram um excelente atendimento e resolveram meu problema por um preço justo. Recomendo a todos.',
    author: 'Julio Prestes',
    role: 'Cliente',
  },
];

const blogPosts = [
  {
    title: 'Demissão por Justa Causa: Conheça Seus Direitos',
    excerpt:
      'Entenda quando a demissão por justa causa pode ser aplicada, quais os direitos do trabalhador e como se defender de uma aplicação indevida.',
    date: '20 Fev 2026',
    readTime: '6 min',
    slug: 'demissao-justa-causa',
    category: 'Direito Trabalhista',
  },
  {
    title: 'Crimes Contra a Honra: Calúnia, Difamação e Injúria',
    excerpt:
      'Saiba as diferenças entre calúnia, difamação e injúria, as penas previstas e como proceder caso seja vítima.',
    date: '15 Fev 2026',
    readTime: '5 min',
    slug: 'crimes-contra-honra',
    category: 'Direito Criminal',
  },
  {
    title: 'Contratos Empresariais: Como Proteger Seu Negócio',
    excerpt:
      'Descubra os elementos essenciais de um contrato empresarial e como evitar cláusulas abusivas que podem prejudicar sua empresa.',
    date: '10 Fev 2026',
    readTime: '7 min',
    slug: 'contratos-empresariais',
    category: 'Direito Empresarial',
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
              subtitle="Oferecemos atuação estratégica e humanizada em diversas áreas do Direito, sempre com ética e compromisso com resultados."
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
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src={IMAGES.lawyer}
                    alt="Sócios Cerbelera & Oliveira Advogados"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative badge */}
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
              <span className="inline-block text-sm font-medium text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
                Sobre o Escritório
              </span>
              <h2 className="section-title">
                Advocacia Estratégica, Ética e Humanizada
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-6">
                O escritório Cerbelera & Oliveira Advogados Associados atua em
                Presidente Prudente e região, oferecendo uma advocacia
                estratégica e humanizada. Nossos sócios, Diogo Ramos Cerbelera
                Neto e Luã Carlos de Oliveira, unem competência técnica e
                sensibilidade humana para defender os direitos de cada cliente.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Atendimento humanizado e personalizado',
                  'Estacionamento próprio para clientes',
                  'Transparência em todas as orientações',
                  'Compromisso com resultados e excelência',
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
      <section className="py-16 bg-gradient-to-r from-[#0a110b] via-[#1a2e1f] to-[#0a110b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="stats-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0v40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" />
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5.0', label: 'Avaliação Google', hasStar: true },
              { number: '12+', label: 'Avaliações de Clientes', hasStar: false },
              { number: '6', label: 'Áreas de Atuação', hasStar: false },
              { number: '100%', label: 'Compromisso Ético', hasStar: false },
            ].map((stat, index) => (
              <AnimatedSection
                key={stat.label}
                delay={index * 0.1}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-3xl md:text-4xl font-bold text-gold-400">
                    {stat.number}
                  </p>
                  {stat.hasStar && (
                    <Star className="w-6 h-6 fill-gold-400 text-gold-400" />
                  )}
                </div>
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
      <section className="py-20 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] relative overflow-hidden">
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
              Entre em contato com o escritório Cerbelera & Oliveira para uma
              consulta. Estamos prontos para defender seus direitos com ética e
              profissionalismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" className="btn-gold text-base">
                Agende uma Consulta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5518996101884'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-primary-300 text-primary-100 hover:bg-primary-100/10 hover:text-white text-base"
              >
                WhatsApp
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-primary-400 text-sm">
              <MapPin className="w-4 h-4" />
              Presidente Prudente, SP • OAB/SP
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
