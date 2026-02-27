import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Scale, User } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { getCategoryImage } from '@/lib/images';
import { articles, defaultArticle } from '@/lib/articles';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug] || defaultArticle;
  return {
    title: article.title,
    description: article.content[0],
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug] || defaultArticle;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getCategoryImage(article.category)}
            alt={article.category}
            fill
            className="object-cover opacity-[0.10]"
            sizes="100vw"
          />
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-300 hover:text-gold-400 transition-colors text-sm mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Blog
            </Link>

            <span className="inline-block text-xs font-medium text-gold-400 bg-gold-500/20 px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 max-w-4xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-primary-300 text-sm">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Cerbelera & Oliveira Advogados
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime} de leitura
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <article className="prose prose-lg max-w-none">
                {article.content.map((item, index) =>
                  item.startsWith('## ') ? (
                    <h2
                      key={index}
                      className="text-2xl font-serif font-bold text-secondary-800 mt-10 mb-4 pb-2 border-b border-gold-200"
                    >
                      {item.slice(3)}
                    </h2>
                  ) : (
                    <p
                      key={index}
                      className="text-secondary-600 leading-relaxed mb-6"
                    >
                      {item}
                    </p>
                  )
                )}
              </article>

              <div className="mt-12 bg-primary-50 border border-primary-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-primary-600 mb-1">
                      Aviso Legal
                    </p>
                    <p className="text-primary-500 text-sm">
                      Este artigo tem caráter meramente informativo e educativo,
                      nos termos do Provimento 205/2021 da OAB. Não constitui
                      aconselhamento jurídico. Para orientação específica,
                      procure um advogado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-secondary-600 mb-4">
                  Ficou com dúvidas sobre este tema?
                </p>
                <Link href="/contato" className="btn-primary">
                  Fale Conosco
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
