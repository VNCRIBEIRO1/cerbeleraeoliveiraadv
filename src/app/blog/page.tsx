import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog Jurídico',
  description:
    'Artigos informativos sobre Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo. Conteúdo educativo sem caráter de aconselhamento jurídico.',
};

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
      'Saiba as diferenças entre calúnia, difamação e injúria, as penas previstas e como proceder caso seja vítima desses crimes.',
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
  {
    title: 'Assédio Moral no Trabalho: Como Identificar e Agir',
    excerpt:
      'Aprenda a reconhecer o assédio moral no ambiente de trabalho, os direitos da vítima e os caminhos jurídicos disponíveis para buscar reparação.',
    date: '05 Fev 2026',
    readTime: '6 min',
    slug: 'assedio-moral-trabalho',
    category: 'Direito Trabalhista',
  },
  {
    title: 'Habeas Corpus: Quando e Como Utilizar Este Instrumento',
    excerpt:
      'Entenda o que é habeas corpus, quando pode ser impetrado, quem pode solicitar e como funciona o processo na prática.',
    date: '01 Fev 2026',
    readTime: '5 min',
    slug: 'habeas-corpus',
    category: 'Direito Criminal',
  },
  {
    title: 'Responsabilidade Civil: Danos Morais e Materiais',
    excerpt:
      'Conheça os tipos de danos indenizáveis, como são calculados os valores e quando é possível ingressar com ação de responsabilidade civil.',
    date: '28 Jan 2026',
    readTime: '7 min',
    slug: 'responsabilidade-civil',
    category: 'Direito Civil',
  },
  {
    title: 'Licitações Públicas: Direitos dos Participantes',
    excerpt:
      'Informações sobre as modalidades de licitação, requisitos de participação, recursos administrativos e impugnação de editais.',
    date: '25 Jan 2026',
    readTime: '8 min',
    slug: 'licitacoes-publicas',
    category: 'Direito Administrativo',
  },
  {
    title: 'Acidente de Trabalho: Direitos e Procedimentos',
    excerpt:
      'Saiba quais são os direitos do trabalhador em caso de acidente de trabalho, como emitir a CAT e quais benefícios podem ser solicitados.',
    date: '20 Jan 2026',
    readTime: '5 min',
    slug: 'acidente-trabalho',
    category: 'Direito Trabalhista',
  },
  {
    title: 'Recuperação Judicial: Salvando Sua Empresa da Falência',
    excerpt:
      'Entenda o processo de recuperação judicial, quem pode solicitar, os prazos envolvidos e como é elaborado o plano de recuperação.',
    date: '15 Jan 2026',
    readTime: '6 min',
    slug: 'recuperacao-judicial',
    category: 'Direito Empresarial',
  },
];

export default function BlogPage() {
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
              <BookOpen className="w-4 h-4" />
              Blog Jurídico
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Artigos <span className="text-gold-400">Informativos</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl">
              Conteúdo educativo para esclarecer dúvidas jurídicas comuns. Este
              blog tem caráter meramente informativo, sem constituir
              aconselhamento jurídico.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Artigos */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.slug} {...post} delay={index * 0.05} />
            ))}
          </div>

          {/* Aviso */}
          <AnimatedSection className="mt-16">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center max-w-3xl mx-auto">
              <p className="text-primary-600 text-sm">
                <strong>Aviso:</strong> Os artigos publicados neste blog têm
                caráter meramente informativo e educativo, não constituindo
                aconselhamento jurídico. Para orientação específica sobre seu
                caso, entre em contato com nosso escritório.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
