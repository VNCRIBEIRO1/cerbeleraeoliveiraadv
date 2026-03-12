import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Termos de Uso | Cerbelera & Oliveira Advogados',
  description:
    'Termos de Uso do site Cerbelera & Oliveira Advogados Associados. Condições de uso, responsabilidades, propriedade intelectual e acessibilidade.',
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
              Última atualização: Março de 2026
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <AnimatedSection>
              {/* 1 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-secondary-600 mb-6">
                Ao acessar e utilizar o site do escritório{' '}
                <strong>Cerbelera & Oliveira Advogados Associados</strong>,
                você concorda integralmente com os presentes Termos de Uso e
                com a nossa{' '}
                <Link href="/politica-privacidade" className="text-primary-600 underline hover:text-primary-800">
                  Política de Privacidade
                </Link>
                . Caso não concorde com alguma disposição, recomendamos que
                não utilize o site.
              </p>

              {/* 2 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                2. Descrição dos Serviços
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site tem finalidade exclusivamente informativa e
                institucional, apresentando informações sobre o escritório,
                áreas de atuação, artigos educativos e meios de contato.
                O conteúdo disponibilizado{' '}
                <strong>não constitui consultoria jurídica</strong>, parecer
                legal ou recomendação profissional, nos termos do Provimento
                205/2021 do Conselho Federal da OAB.
              </p>

              {/* 3 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                3. Conteúdo Informativo e Educativo
              </h2>
              <p className="text-secondary-600 mb-6">
                Os artigos e informações publicados neste site possuem caráter
                meramente informativo e educativo. Não substituem a consulta a
                um advogado para análise de casos concretos. Cada situação
                jurídica possui particularidades que demandam orientação
                profissional individualizada. A legislação citada pode sofrer
                alterações, e é responsabilidade do usuário verificar a vigência
                das normas mencionadas.
              </p>

              {/* 4 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                4. Propriedade Intelectual
              </h2>
              <p className="text-secondary-600 mb-4">
                Todo o conteúdo deste site — incluindo textos, imagens,
                logotipos, marcas, layout, design gráfico e código-fonte — é de
                propriedade do escritório Cerbelera & Oliveira Advogados
                Associados ou de seus licenciadores, sendo protegido pela
                legislação brasileira de direitos autorais (Lei nº 9.610/1998)
                e de propriedade industrial (Lei nº 9.279/1996).
              </p>
              <p className="text-secondary-600 mb-6">
                É expressamente proibida a reprodução, distribuição,
                modificação, engenharia reversa ou utilização comercial do
                conteúdo sem autorização prévia e por escrito. O uso pessoal e
                não comercial de trechos é permitido desde que citada a fonte.
              </p>

              {/* 5 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                5. Uso do Formulário de Contato e Agendamento
              </h2>
              <p className="text-secondary-600 mb-6">
                O envio de mensagem através do formulário de contato ou a
                solicitação de agendamento <strong>não estabelece relação
                cliente-advogado</strong>. As informações enviadas serão
                tratadas de forma confidencial, conforme nossa{' '}
                <Link href="/politica-privacidade" className="text-primary-600 underline hover:text-primary-800">
                  Política de Privacidade
                </Link>
                , mas o escritório não se obriga a prestar consultoria a
                partir do contato realizado.
              </p>

              {/* 6 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                6. Privacidade e Proteção de Dados
              </h2>
              <p className="text-secondary-600 mb-6">
                O tratamento de dados pessoais realizado por meio deste site
                obedece à Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
                LGPD). Para informações completas sobre coleta, uso,
                armazenamento e seus direitos como titular de dados, consulte
                nossa{' '}
                <Link href="/politica-privacidade" className="text-primary-600 underline hover:text-primary-800">
                  Política de Privacidade
                </Link>
                . Ferramentas de análise de desempenho (cookies não essenciais)
                são ativadas somente após o seu consentimento expresso.
              </p>

              {/* 7 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                7. Sistemas Automatizados
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site pode disponibilizar ferramentas automatizadas, como
                assistente virtual e calculadora de direitos. Essas ferramentas
                utilizam respostas pré-definidas e{' '}
                <strong>não constituem aconselhamento jurídico</strong>.
                Os resultados gerados são estimativas baseadas em parâmetros
                gerais e podem não refletir as particularidades de cada caso.
                Recomenda-se sempre a consulta presencial com um advogado.
              </p>

              {/* 8 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                8. Disponibilidade do Site
              </h2>
              <p className="text-secondary-600 mb-6">
                O escritório empreende esforços razoáveis para manter o site
                disponível e funcional, mas não garante que o acesso será
                ininterrupto, livre de erros ou de componentes prejudiciais.
                Manutenções programadas, atualizações e eventos de força maior
                podem causar indisponibilidade temporária, sem que isso gere
                direito a indenização.
              </p>

              {/* 9 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                9. Conduta do Usuário
              </h2>
              <p className="text-secondary-600 mb-4">
                Ao utilizar o site, o usuário compromete-se a:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>Não utilizar o conteúdo para fins ilícitos ou contrários à moral e aos bons costumes;</li>
                <li>Não tentar obter acesso não autorizado a áreas restritas do sistema;</li>
                <li>Não reproduzir ou distribuir o conteúdo para fins comerciais sem autorização;</li>
                <li>Fornecer informações verdadeiras e atualizadas nos formulários de contato.</li>
              </ul>

              {/* 10 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                10. Limitação de Responsabilidade
              </h2>
              <p className="text-secondary-600 mb-4">
                O escritório Cerbelera & Oliveira Advogados Associados{' '}
                <strong>não se responsabiliza</strong> por:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>Decisões tomadas com base nas informações disponibilizadas neste site;</li>
                <li>Resultados obtidos a partir do uso da calculadora de direitos ou do assistente automatizado;</li>
                <li>Danos diretos ou indiretos decorrentes da indisponibilidade ou mau funcionamento do site;</li>
                <li>Conteúdo de sites de terceiros acessados por meio de links disponibilizados.</li>
              </ul>
              <p className="text-secondary-600 mb-6">
                O conteúdo é fornecido &ldquo;como está&rdquo;, sem garantias
                de completude, precisão ou adequação para finalidades
                específicas.
              </p>

              {/* 11 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                11. Links Externos
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site pode conter links para sites de terceiros. O
                escritório não se responsabiliza pelo conteúdo, políticas de
                privacidade ou práticas de sites externos. A inclusão de links
                não implica endosso ou parceria. Recomendamos a leitura dos
                termos e políticas de cada site acessado.
              </p>

              {/* 12 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                12. Acessibilidade
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site foi desenvolvido com preocupação de acessibilidade,
                utilizando design responsivo, contrastes adequados e estrutura
                semântica de HTML. Sugerimos o uso de leitores de tela e
                tecnologias assistivas para uma melhor experiência de navegação.
                Se encontrar alguma barreira de acesso, por favor entre em
                contato pelo e-mail{' '}
                <a
                  href="mailto:contato@cerbeleraoliveira.adv.br"
                  className="text-primary-600 underline hover:text-primary-800"
                >
                  contato@cerbeleraoliveira.adv.br
                </a>{' '}
                para que possamos aprimorar o site.
              </p>

              {/* 13 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                13. Legislação Aplicável e Foro
              </h2>
              <p className="text-secondary-600 mb-6">
                Estes Termos de Uso são regidos pela legislação da República
                Federativa do Brasil. Eventuais disputas oriundas do uso deste
                site serão submetidas ao Foro da Comarca de Presidente
                Prudente/SP, com renúncia a qualquer outro, por mais
                privilegiado que seja.
              </p>

              {/* 14 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                14. Alterações dos Termos
              </h2>
              <p className="text-secondary-600 mb-6">
                Reservamo-nos o direito de modificar estes Termos de Uso a
                qualquer momento, mediante publicação da versão atualizada
                neste site com a nova data de revisão. O uso continuado do site
                após alterações implica aceitação dos novos termos.
              </p>

              {/* 15 */}
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                15. Contato
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
                  <strong>Advogados:</strong> Me. Diogo Ramos Cerbelera Neto
                  (OAB/SP 425.172) e Luã Carlos Souza de Oliveira (OAB/SP
                  395.965)
                </li>
                <li>
                  <strong>Telefone:</strong> (18) 99610-1884
                </li>
                <li>
                  <strong>E-mail:</strong>{' '}
                  <a
                    href="mailto:contato@cerbeleraoliveira.adv.br"
                    className="text-primary-600 underline hover:text-primary-800"
                  >
                    contato@cerbeleraoliveira.adv.br
                  </a>
                </li>
              </ul>

              <div className="mt-10 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                <p className="text-secondary-500 text-sm text-center">
                  Este site tem caráter meramente informativo, nos termos do
                  Provimento 205/2021 da OAB. Nenhuma informação aqui
                  apresentada constitui promessa de resultado.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
