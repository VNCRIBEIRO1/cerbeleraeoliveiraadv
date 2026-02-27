import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Scale, User } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { getCategoryImage } from '@/lib/images';

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
  'demissao-justa-causa': {
    title: 'Demissão por Justa Causa: Conheça Seus Direitos',
    category: 'Direito Trabalhista',
    date: '20 Fev 2026',
    readTime: '6 min',
    content: [
      'A demissão por justa causa é a penalidade máxima aplicável ao empregado, prevista no artigo 482 da Consolidação das Leis do Trabalho (CLT). Ela ocorre quando o trabalhador comete uma falta grave que torna impossível a continuidade da relação de emprego.',
      'Entre as hipóteses de justa causa previstas na CLT estão: ato de improbidade (desonestidade), incontinência de conduta ou mau procedimento, negociação habitual sem permissão do empregador, condenação criminal transitada em julgado, desídia no desempenho das funções, embriaguez habitual ou em serviço, violação de segredo da empresa, indisciplina ou insubordinação, abandono de emprego, entre outras.',
      'Quando o trabalhador é demitido por justa causa, ele perde diversos direitos, como o aviso prévio, a multa de 40% do FGTS, o saque do FGTS e o seguro-desemprego. O empregado demitido por justa causa tem direito apenas ao saldo de salário, às férias vencidas com adicional de 1/3 e ao 13º salário proporcional.',
      'É importante destacar que a justa causa deve obedecer a alguns princípios: imediatidade (a punição deve ser aplicada logo após a falta), proporcionalidade (a punição deve ser proporcional à falta), non bis in idem (não se pode punir duas vezes pela mesma falta) e gradação das penalidades (advertência, suspensão e, por último, justa causa).',
      'Se o trabalhador entender que a justa causa foi aplicada de forma indevida, ele pode ingressar com uma reclamação trabalhista para reverter a demissão. O prazo para ajuizar a ação é de 2 anos após o término do contrato de trabalho, podendo pleitear verbas dos últimos 5 anos.',
      'É fundamental que o empregador documente adequadamente os motivos da justa causa, pois o ônus da prova é seu. A ausência de provas pode levar à reversão da justa causa pela Justiça do Trabalho, obrigando o pagamento de todas as verbas rescisórias.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico. Para orientação específica sobre seu caso, procure um advogado.',
    ],
  },
  'crimes-contra-honra': {
    title: 'Crimes Contra a Honra: Calúnia, Difamação e Injúria',
    category: 'Direito Criminal',
    date: '15 Fev 2026',
    readTime: '5 min',
    content: [
      'Os crimes contra a honra estão previstos nos artigos 138 a 140 do Código Penal brasileiro e protegem a dignidade, a reputação e o decoro das pessoas. São três os tipos: calúnia, difamação e injúria.',
      'A calúnia (art. 138, CP) consiste em atribuir falsamente a alguém a prática de um fato definido como crime. Por exemplo, dizer que uma pessoa cometeu um roubo quando isso não é verdade. A pena é de detenção de 6 meses a 2 anos, e multa.',
      'A difamação (art. 139, CP) ocorre quando se atribui a alguém fato ofensivo à sua reputação, mas que não constitui crime. A pena é de detenção de 3 meses a 1 ano, e multa.',
      'A injúria (art. 140, CP) é a ofensa à dignidade ou ao decoro de alguém, sem atribuição de fato específico. Xingamentos e insultos são exemplos típicos. A injúria racial tem pena de reclusão de 1 a 3 anos e multa.',
      'Os crimes contra a honra são, em regra, de ação penal privada. O prazo para queixa-crime é de 6 meses a contar do conhecimento da autoria.',
      'Além da esfera criminal, a vítima pode buscar indenização por danos morais na esfera cível. As ofensas praticadas pela internet têm ganhado destaque nos tribunais.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'contratos-empresariais': {
    title: 'Contratos Empresariais: Como Proteger Seu Negócio',
    category: 'Direito Empresarial',
    date: '10 Fev 2026',
    readTime: '7 min',
    content: [
      'Os contratos empresariais são instrumentos jurídicos essenciais para regular as relações comerciais entre empresas, fornecedores, clientes e parceiros de negócios. Uma boa redação contratual é a primeira linha de defesa do empresário.',
      'Os elementos essenciais de um contrato empresarial incluem: identificação completa das partes, objeto do contrato, preço e condições de pagamento, prazo de vigência, obrigações de cada parte, cláusulas de rescisão e penalidades, e foro de eleição.',
      'Entre os principais tipos de contratos empresariais estão: contrato de prestação de serviços, compra e venda mercantil, distribuição, franquia, representação comercial, parceria comercial, acordo de confidencialidade (NDA) e contrato de licenciamento.',
      'Cláusulas abusivas são aquelas que colocam uma das partes em desvantagem excessiva. Exemplos comuns incluem: multas desproporcionais, renúncia prévia a direitos fundamentais, exclusividade sem contrapartida adequada e limitação excessiva de responsabilidade.',
      'A assessoria jurídica na elaboração e revisão de contratos é um investimento fundamental para prevenir litígios futuros e garantir que os termos sejam claros, equilibrados e legalmente válidos.',
      'Em caso de descumprimento contratual, as partes podem recorrer à mediação, arbitragem ou ao Poder Judiciário para buscar a execução do contrato ou a reparação por perdas e danos.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'assedio-moral-trabalho': {
    title: 'Assédio Moral no Trabalho: Como Identificar e Agir',
    category: 'Direito Trabalhista',
    date: '05 Fev 2026',
    readTime: '6 min',
    content: [
      'O assédio moral no trabalho é caracterizado pela exposição repetitiva e prolongada do trabalhador a situações humilhantes e constrangedoras durante o exercício de suas funções. Trata-se de uma violência psicológica que afeta a dignidade e a saúde do empregado.',
      'Condutas que podem configurar assédio moral incluem: críticas constantes e injustificadas ao trabalho, isolamento do empregado, atribuição de tarefas humilhantes ou incompatíveis com a função, ameaças frequentes de demissão, vigilância excessiva, tratamento diferenciado e hostil, e sabotagem do trabalho realizado.',
      'O assédio moral pode ser classificado como: vertical descendente (de superior para subordinado), vertical ascendente (de subordinado para superior) ou horizontal (entre colegas de mesmo nível hierárquico).',
      'A vítima de assédio moral pode buscar a rescisão indireta do contrato de trabalho (artigo 483 da CLT), que garante todos os direitos como se fosse demitida sem justa causa, além de indenização por danos morais e materiais.',
      'Para comprovar o assédio moral, é importante reunir provas como: e-mails e mensagens, gravações (desde que o trabalhador participe da conversa), testemunhas, laudos médicos e psicológicos, e registros de afastamentos.',
      'As empresas têm o dever de prevenir o assédio moral, implementando políticas de compliance, canais de denúncia, treinamentos para lideranças e medidas disciplinares contra assediadores.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'habeas-corpus': {
    title: 'Habeas Corpus: Quando e Como Utilizar Este Instrumento',
    category: 'Direito Criminal',
    date: '01 Fev 2026',
    readTime: '5 min',
    content: [
      'O habeas corpus é um remédio constitucional previsto no artigo 5º, inciso LXVIII, da Constituição Federal, que protege o direito de liberdade de locomoção contra ilegalidade ou abuso de poder.',
      'Existem duas modalidades de habeas corpus: o liberatório (quando a pessoa já está presa ilegalmente e busca a soltura) e o preventivo (quando há ameaça concreta e iminente de prisão ilegal, buscando um salvo-conduto).',
      'Qualquer pessoa pode impetrar habeas corpus em favor próprio ou de terceiro, não sendo necessário ser advogado para fazê-lo. Também não há custas processuais para sua impetração.',
      'Situações que justificam o habeas corpus incluem: prisão em flagrante ilegal, excesso de prazo na prisão preventiva, falta de fundamentação adequada na decisão de prisão, prisão por dívida civil (exceto pensão alimentícia), e cerceamento do direito de defesa.',
      'A competência para julgar o habeas corpus varia conforme a autoridade coatora: Tribunal de Justiça (quando a autoridade coatora é juiz de primeiro grau), STJ (quando é desembargador) ou STF (quando é ministro de tribunal superior).',
      'O habeas corpus é um instrumento fundamental para a garantia das liberdades individuais e deve ser utilizado sempre que houver constrangimento ilegal à liberdade de ir e vir.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'responsabilidade-civil': {
    title: 'Responsabilidade Civil: Danos Morais e Materiais',
    category: 'Direito Civil',
    date: '28 Jan 2026',
    readTime: '7 min',
    content: [
      'A responsabilidade civil é a obrigação de reparar o dano causado a outra pessoa, seja por ação ou omissão. Está prevista nos artigos 186 e 927 do Código Civil brasileiro.',
      'O dano material compreende o prejuízo financeiro efetivamente sofrido pela vítima, dividindo-se em danos emergentes (o que efetivamente perdeu) e lucros cessantes (o que razoavelmente deixou de ganhar).',
      'O dano moral consiste na lesão aos direitos da personalidade, como honra, imagem, intimidade e dignidade. Diferente do dano material, não necessita de comprovação de prejuízo financeiro — é o chamado dano "in re ipsa".',
      'Para configurar a responsabilidade civil, são necessários quatro elementos: ação ou omissão do agente, culpa (na responsabilidade subjetiva), dano efetivo e nexo de causalidade entre a conduta e o dano.',
      'A responsabilidade civil pode ser subjetiva (quando se exige a comprovação de culpa) ou objetiva (quando independe de culpa, como nas relações de consumo previstas no CDC).',
      'Os valores de indenização por danos morais são fixados pelo juiz com base em diversos critérios: gravidade da ofensa, condição econômica das partes, caráter pedagógico da condenação, e precedentes jurisprudenciais.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'licitacoes-publicas': {
    title: 'Licitações Públicas: Direitos dos Participantes',
    category: 'Direito Administrativo',
    date: '25 Jan 2026',
    readTime: '8 min',
    content: [
      'As licitações públicas são procedimentos administrativos obrigatórios para contratações realizadas pela Administração Pública, visando garantir a isonomia entre os participantes e a seleção da proposta mais vantajosa para o interesse público.',
      'A Nova Lei de Licitações (Lei nº 14.133/2021) trouxe importantes mudanças, incluindo novas modalidades licitatórias: pregão, concorrência, concurso, leilão e diálogo competitivo, além de procedimentos auxiliares como credenciamento e registro de preços.',
      'Os princípios que regem as licitações incluem: legalidade, impessoalidade, moralidade, igualdade, publicidade, probidade administrativa, vinculação ao instrumento convocatório e julgamento objetivo.',
      'Os participantes de licitações têm direitos fundamentais como: acesso às informações do certame, prazo adequado para elaboração de propostas, recurso contra decisões da comissão, tratamento isonômico, transparência nos critérios de julgamento e ampla defesa.',
      'A impugnação do edital pode ser feita por qualquer pessoa até 3 dias úteis antes da abertura (para licitantes) ou até 10 dias úteis (para qualquer cidadão), questionando cláusulas ilegais ou restritivas.',
      'Em caso de irregularidades graves no processo licitatório, os participantes podem recorrer ao Tribunal de Contas, ao Ministério Público ou ao Poder Judiciário para garantir seus direitos e a lisura do certame.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'acidente-trabalho': {
    title: 'Acidente de Trabalho: Direitos e Procedimentos',
    category: 'Direito Trabalhista',
    date: '20 Jan 2026',
    readTime: '5 min',
    content: [
      'O acidente de trabalho é aquele que ocorre pelo exercício do trabalho a serviço da empresa, provocando lesão corporal, perturbação funcional ou doença que cause morte, perda ou redução da capacidade para o trabalho (artigo 19 da Lei nº 8.213/91).',
      'Equiparam-se ao acidente de trabalho: doenças profissionais (desencadeadas pela atividade), doenças do trabalho (adquiridas pelas condições de trabalho), acidente de trajeto (no percurso residência-trabalho) e agressões sofridas no local de trabalho.',
      'O empregador é obrigado a emitir a CAT (Comunicação de Acidente de Trabalho) até o primeiro dia útil seguinte ao acidente. Se o empregador não emitir, podem fazê-lo o acidentado, seus dependentes, o sindicato, o médico ou qualquer autoridade pública.',
      'Os direitos do trabalhador acidentado incluem: estabilidade provisória de 12 meses após o retorno ao trabalho, manutenção dos depósitos do FGTS durante o afastamento, auxílio-doença acidentário (B91) e, em caso de incapacidade permanente, aposentadoria por invalidez.',
      'Além dos benefícios previdenciários, o trabalhador pode pleitear indenização por danos morais e materiais contra o empregador, caso se comprove culpa ou dolo na ocorrência do acidente.',
      'A prevenção é fundamental: uso de EPIs adequados, treinamentos de segurança, CIPA ativa, cumprimento das Normas Regulamentadoras (NRs) e manutenção de ambiente de trabalho seguro.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
  'recuperacao-judicial': {
    title: 'Recuperação Judicial: Salvando Sua Empresa da Falência',
    category: 'Direito Empresarial',
    date: '15 Jan 2026',
    readTime: '6 min',
    content: [
      'A recuperação judicial, prevista na Lei nº 11.101/2005 (atualizada pela Lei nº 14.112/2020), tem como objetivo viabilizar a superação da crise econômico-financeira do devedor empresário, permitindo a manutenção da atividade empresarial, dos empregos e dos interesses dos credores.',
      'Para requerer a recuperação judicial, o empresário deve exercer atividade regular há mais de 2 anos, não ser falido (ou ter suas obrigações declaradas extintas), não ter obtido recuperação judicial nos últimos 5 anos e não ter sido condenado por crimes falimentares.',
      'O processo se inicia com o pedido ao juízo competente, acompanhado de extensa documentação contábil e financeira. Uma vez deferido o processamento, a empresa tem 60 dias para apresentar o plano de recuperação.',
      'O plano de recuperação pode prever diversas medidas, como: concessão de prazos e condições especiais para pagamento, cisão, incorporação, fusão ou transformação da sociedade, venda parcial de bens, substituição de administradores e modificação dos contratos.',
      'Uma das principais vantagens da recuperação judicial é o chamado "stay period" — a suspensão de todas as ações e execuções contra o devedor pelo prazo de 180 dias, permitindo que a empresa reorganize suas finanças.',
      'Os credores são classificados em classes (trabalhistas, garantia real, quirografários e ME/EPP) e votam o plano em assembleia geral. O plano deve ser aprovado por todas as classes para ser homologado pelo juiz.',
      'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
};

const defaultArticle = {
  title: 'Artigo Informativo',
  category: 'Direito',
  date: 'Fev 2026',
  readTime: '5 min',
  content: [
    'Este é um artigo informativo sobre temas jurídicos relevantes. O conteúdo completo será disponibilizado em breve.',
    'Para mais informações, entre em contato com Cerbelera & Oliveira Advogados.',
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
  return Object.keys(articles).map((slug) => ({ slug }));
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
                {article.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-secondary-600 leading-relaxed mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
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
