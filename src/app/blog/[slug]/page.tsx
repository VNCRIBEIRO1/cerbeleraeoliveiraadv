import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Scale, User } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import BlogIllustration from '@/components/illustrations/BlogIllustration';

// Dados dos artigos
const articles: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    readTime: string;
    content: string[];
  }
> = {
  'direitos-trabalhistas': {
    title: 'Seus Direitos Trabalhistas: O que Todo Trabalhador Deve Saber',
    category: 'Direito Trabalhista',
    date: '20 Fev 2026',
    readTime: '5 min',
    content: [
      'A Consolidação das Leis do Trabalho (CLT) garante uma série de direitos fundamentais aos trabalhadores brasileiros. Conhecer esses direitos é essencial para identificar possíveis irregularidades na relação de trabalho.',
      'Entre os principais direitos trabalhistas estão: carteira de trabalho assinada, salário mínimo, jornada de trabalho de 44 horas semanais, férias remuneradas com adicional de 1/3, 13º salário, FGTS, seguro-desemprego e vale-transporte.',
      'Em caso de rescisão sem justa causa, o trabalhador tem direito ao aviso prévio (trabalhado ou indenizado), multa de 40% sobre o FGTS, saque do FGTS e seguro-desemprego, desde que atendidos os requisitos legais.',
      'É importante ressaltar que o trabalhador tem o prazo de até 2 anos após o término do contrato de trabalho para ingressar com uma reclamação trabalhista, podendo pleitear verbas dos últimos 5 anos.',
      'Situações como não pagamento de horas extras, ausência de registro em carteira, assédio moral ou sexual, e condições de trabalho insalubres ou perigosas são irregularidades que devem ser comunicadas aos órgãos competentes.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico. Para orientação específica sobre seu caso, procure um advogado.',
    ],
  },
  'guarda-compartilhada': {
    title: 'Guarda Compartilhada: Entenda Como Funciona na Prática',
    category: 'Direito de Família',
    date: '15 Fev 2026',
    readTime: '4 min',
    content: [
      'A guarda compartilhada é o modelo preferencial previsto no Código Civil brasileiro (Lei nº 13.058/2014). Nesse regime, ambos os pais exercem conjuntamente a responsabilidade e as decisões sobre a vida dos filhos.',
      'Diferente da guarda alternada, onde a criança alterna períodos iguais com cada genitor, na guarda compartilhada as decisões são tomadas em conjunto, embora a criança tenha uma residência principal.',
      'O juiz, ao definir a guarda, levará em conta sempre o melhor interesse da criança ou adolescente, considerando fatores como vínculo afetivo, condições do lar e proximidade de escola e atividades.',
      'A guarda compartilhada pode ser estabelecida por acordo entre os pais ou por determinação judicial. Mesmo em caso de litígio, o juiz pode determinar a guarda compartilhada, salvo se um dos genitores declarar que não deseja a guarda.',
      'É importante que os pais mantenham uma comunicação respeitosa e colaborativa para o bom funcionamento da guarda compartilhada, sempre priorizando o bem-estar dos filhos.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
};

// Artigo padrão para slugs sem conteúdo específico
const defaultArticle = {
  title: 'Artigo Informativo',
  category: 'Direito',
  date: 'Fev 2026',
  readTime: '5 min',
  content: [
    'Este é um artigo informativo sobre temas jurídicos relevantes. O conteúdo completo será disponibilizado em breve.',
    'Para mais informações sobre este tema, entre em contato com nosso escritório. Teremos prazer em esclarecer suas dúvidas.',
    'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
  ],
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = articles[params.slug] || defaultArticle;
  return {
    title: article.title,
    description: article.content[0],
  };
}

export function generateStaticParams() {
  return [
    { slug: 'direitos-trabalhistas' },
    { slug: 'guarda-compartilhada' },
    { slug: 'lgpd-direitos' },
    { slug: 'aposentadoria-reforma' },
    { slug: 'cobrancas-indevidas' },
    { slug: 'usucapiao-imovel' },
    { slug: 'divorcio-tipos' },
    { slug: 'acidente-trabalho' },
    { slug: 'pensao-alimenticia' },
  ];
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles[params.slug] || defaultArticle;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
        {/* Category illustration background */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] opacity-[0.06] pointer-events-none hidden lg:block">
          <BlogIllustration category={article.category} className="w-full h-full" />
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

            <div className="flex items-center gap-6 text-primary-300 text-sm">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Roberto Sartoro
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
                {article.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-secondary-600 leading-relaxed mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* Aviso */}
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
                      aconselhamento jurídico. Para orientação específica sobre
                      seu caso, procure um advogado.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
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
