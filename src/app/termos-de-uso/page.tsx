import type { Metadata } from 'next';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso do site Cerbelera & Oliveira Advogados Associados.',
};

export default function TermosDeUsoPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f]">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
              Termos de Uso
            </h1>
            <p className="text-primary-300 text-lg">
              Última atualização: Fevereiro de 2026
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <AnimatedSection>
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-secondary-600 mb-6">
                Ao acessar e utilizar o site do escritório{' '}
                <strong>Cerbelera & Oliveira Advogados Associados</strong>,
                você concorda com os presentes Termos de Uso. Caso não concorde
                com alguma disposição, recomendamos que não utilize o site.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                2. Descrição dos Serviços
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site tem finalidade informativa e institucional,
                apresentando informações sobre o escritório, áreas de atuação,
                artigos informativos e meios de contato. O conteúdo
                disponibilizado não constitui consultoria jurídica, parecer
                legal ou recomendação profissional.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                3. Conteúdo Informativo
              </h2>
              <p className="text-secondary-600 mb-6">
                Os artigos e informações publicados neste site possuem caráter
                meramente informativo e educativo, nos termos do Provimento
                205/2021 do Conselho Federal da OAB. Não substituem a
                consulta a um advogado para análise de casos concretos. Cada
                situação jurídica possui particularidades que demandam
                orientação profissional individualizada.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                4. Propriedade Intelectual
              </h2>
              <p className="text-secondary-600 mb-6">
                Todo o conteúdo deste site — incluindo textos, imagens, logotipos,
                marcas, layout e código-fonte — é de propriedade do escritório
                Cerbelera & Oliveira Advogados Associados ou de seus
                licenciadores, sendo protegido pela legislação brasileira de
                propriedade intelectual. É proibida a reprodução, distribuição
                ou utilização sem autorização prévia e expressa.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                5. Uso do Formulário de Contato
              </h2>
              <p className="text-secondary-600 mb-6">
                O envio de mensagem através do formulário de contato não
                estabelece relação cliente-advogado. As informações enviadas
                serão tratadas de forma confidencial, conforme nossa Política
                de Privacidade, mas o escritório não se obriga a prestar
                consultoria a partir do contato realizado.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                6. Limitação de Responsabilidade
              </h2>
              <p className="text-secondary-600 mb-6">
                O escritório Cerbelera & Oliveira Advogados Associados não se
                responsabiliza por decisões tomadas com base nas informações
                disponibilizadas neste site. O conteúdo é fornecido "como
                está", sem garantias de completude, precisão ou adequação
                para finalidades específicas.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                7. Links Externos
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site pode conter links para sites de terceiros. O
                escritório não se responsabiliza pelo conteúdo, políticas de
                privacidade ou práticas de sites externos. Recomendamos a
                leitura dos termos e políticas de cada site acessado.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                8. Legislação Aplicável
              </h2>
              <p className="text-secondary-600 mb-6">
                Estes Termos de Uso são regidos pela legislação brasileira.
                Eventuais disputas serão submetidas ao Foro da Comarca de
                Presidente Prudente/SP.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                9. Alterações dos Termos
              </h2>
              <p className="text-secondary-600 mb-6">
                Reservamo-nos o direito de modificar estes Termos de Uso a
                qualquer momento, mediante publicação da versão atualizada
                neste site. O uso continuado do site após alterações implica
                aceitação dos novos termos.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                10. Contato
              </h2>
              <p className="text-secondary-600 mb-6">
                Em caso de dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul className="list-none text-secondary-600 mb-6 space-y-2">
                <li>
                  <strong>Escritório:</strong> Cerbelera & Oliveira Advogados
                  Associados
                </li>
                <li>
                  <strong>Endereço:</strong> R. Francisco Machado de Campos, 393
                  — Vila Nova, Presidente Prudente/SP — CEP 19010-300
                </li>
                <li>
                  <strong>Telefone:</strong> (18) 99610-1884
                </li>
                <li>
                  <strong>E-mail:</strong> contato@cerbeleraoliveira.adv.br
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
