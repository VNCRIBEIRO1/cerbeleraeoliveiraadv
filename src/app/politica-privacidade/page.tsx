import type { Metadata } from 'next';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade do escritório Cerbelera & Oliveira Advogados Associados.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f]">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
              Política de Privacidade
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
                1. Informações Gerais
              </h2>
              <p className="text-secondary-600 mb-6">
                A presente Política de Privacidade contém informações sobre
                coleta, uso, armazenamento, tratamento e proteção dos dados
                pessoais dos usuários do site{' '}
                <strong>Cerbelera & Oliveira Advogados Associados</strong>,
                com a finalidade de demonstrar absoluta transparência quanto ao
                assunto e esclarecer a todos interessados sobre os tipos de
                dados que são coletados, os motivos da coleta e a forma como os
                usuários podem gerenciar ou excluir as suas informações
                pessoais.
              </p>
              <p className="text-secondary-600 mb-6">
                Esta política se aplica ao site e a todos os serviços prestados
                pelo escritório Cerbelera & Oliveira Advogados Associados, com
                sede em Presidente Prudente/SP, integrado pelos advogados
                Me. Diogo Ramos Cerbelera Neto (OAB/SP 425.172) e Luã Carlos
                Souza de Oliveira (OAB/SP 395.965).
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                2. Dados Coletados
              </h2>
              <p className="text-secondary-600 mb-4">
                Os dados pessoais coletados incluem, mas não se limitam a:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Mensagem enviada pelo formulário de contato</li>
                <li>
                  Dados de navegação (cookies, endereço IP, tipo de navegador)
                </li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                3. Finalidade dos Dados e Bases Legais
              </h2>
              <p className="text-secondary-600 mb-4">
                Os dados coletados são utilizados para as seguintes finalidades,
                com as respectivas bases legais previstas no Art. 7º da LGPD:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>
                  <strong>Responder solicitações de contato</strong> — Base
                  legal: execução de procedimentos preliminares relacionados a
                  contrato (Art. 7º, V)
                </li>
                <li>
                  <strong>Agendar consultas e atendimentos</strong> — Base
                  legal: execução de contrato ou de procedimentos preliminares
                  (Art. 7º, V)
                </li>
                <li>
                  <strong>Melhorar a experiência de navegação</strong> — Base
                  legal: legítimo interesse do controlador (Art. 7º, IX)
                </li>
                <li>
                  <strong>
                    Enviar comunicações relevantes
                  </strong>{' '}
                  — Base legal: consentimento do titular (Art. 7º, I)
                </li>
                <li>
                  <strong>
                    Cumprir obrigações legais e regulatórias
                  </strong>{' '}
                  — Base legal: cumprimento de obrigação legal (Art. 7º, II)
                </li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                4. Prazo de Retenção dos Dados
              </h2>
              <p className="text-secondary-600 mb-4">
                Os dados pessoais serão armazenados pelo tempo necessário para
                cumprir as finalidades para as quais foram coletados, observados
                os seguintes prazos:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>
                  <strong>Dados de contato e agendamento:</strong> até 5 anos
                  após o último contato, ou enquanto houver relação contratual
                  ativa
                </li>
                <li>
                  <strong>Dados processuais e jurídicos:</strong> pelo prazo
                  prescricional aplicável, conforme a legislação vigente (até 20
                  anos em ações de reparação civil)
                </li>
                <li>
                  <strong>Dados de navegação (cookies):</strong> até 12 meses
                  ou até a revogação do consentimento pelo titular
                </li>
                <li>
                  <strong>Comunicações por e-mail:</strong> enquanto houver
                  consentimento ativo do titular, podendo ser revogado a
                  qualquer tempo
                </li>
              </ul>
              <p className="text-secondary-600 mb-6">
                Após o término do prazo de retenção, os dados serão eliminados
                ou anonimizados, salvo quando a conservação for necessária para
                cumprimento de obrigação legal ou regulatória (Art. 16, I, LGPD).
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                5. Compartilhamento de Dados
              </h2>
              <p className="text-secondary-600 mb-6">
                O escritório <strong>não compartilha, vende ou aluga</strong>{' '}
                dados pessoais dos usuários a terceiros, exceto quando
                necessário para cumprimento de obrigações legais ou mediante
                consentimento expresso do titular dos dados.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                6. Segurança dos Dados
              </h2>
              <p className="text-secondary-600 mb-6">
                Adotamos medidas de segurança técnicas e administrativas aptas a
                proteger os dados pessoais contra acessos não autorizados,
                destruição, perda, alteração ou qualquer forma de tratamento
                inadequado. Utilizamos protocolos de segurança como HTTPS/SSL
                para proteger as informações transmitidas.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                7. Cookies
              </h2>
              <p className="text-secondary-600 mb-4">
                Este site utiliza cookies para melhorar a experiência de
                navegação. Os cookies são pequenos arquivos armazenados no
                dispositivo do usuário que permitem personalizar o conteúdo e
                analisar o tráfego do site.
              </p>
              <p className="text-secondary-600 mb-4">
                Ao acessar o site pela primeira vez, um banner de consentimento
                é exibido ao usuário, que pode optar por:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-4 space-y-2">
                <li>
                  <strong>Aceitar Todos:</strong> permite o uso de cookies de
                  análise (Vercel Analytics e Speed Insights) para melhoria do
                  site
                </li>
                <li>
                  <strong>Apenas Essenciais:</strong> desativa cookies de
                  análise, mantendo apenas os estritamente necessários para o
                  funcionamento do site
                </li>
              </ul>
              <p className="text-secondary-600 mb-6">
                A escolha do usuário é armazenada localmente e pode ser alterada
                a qualquer momento nas configurações do navegador. Ferramentas de
                análise somente são carregadas após o consentimento expresso do
                usuário.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                8. Direitos do Titular (LGPD)
              </h2>
              <p className="text-secondary-600 mb-4">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº
                13.709/2018 — LGPD), o titular dos dados pessoais tem direito a:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos seus dados</li>
                <li>Correção de dados incompletos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                9. Encarregado de Dados (DPO)
              </h2>
              <p className="text-secondary-600 mb-4">
                Em conformidade com o Art. 41 da LGPD (Lei nº 13.709/2018), o
                escritório Cerbelera & Oliveira Advogados Associados designa
                como Encarregado pelo tratamento de dados pessoais (DPO):
              </p>
              <ul className="list-none text-secondary-600 mb-6 space-y-2">
                <li>
                  <strong>Encarregado (DPO):</strong> Me. Diogo Ramos Cerbelera Neto
                </li>
                <li>
                  <strong>E-mail do DPO:</strong>{' '}
                  <a
                    href="mailto:privacidade@cerbeleraoliveira.adv.br"
                    className="text-primary-600 underline hover:text-primary-800"
                  >
                    privacidade@cerbeleraoliveira.adv.br
                  </a>
                </li>
                <li>
                  <strong>Telefone:</strong> (18) 99610-1884
                </li>
              </ul>
              <p className="text-secondary-600 mb-6">
                O Encarregado de Dados é responsável por aceitar reclamações e
                comunicações dos titulares, prestar esclarecimentos e adotar
                providências; receber comunicações da Autoridade Nacional de
                Proteção de Dados (ANPD) e adotar providências; orientar os
                funcionários e os contratados da entidade a respeito das
                práticas a serem tomadas em relação à proteção de dados pessoais;
                e executar as demais atribuições determinadas pelo controlador
                ou estabelecidas em normas complementares.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                10. Contato
              </h2>
              <p className="text-secondary-600 mb-6">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                Política de Privacidade, entre em contato conosco:
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
                  <strong>E-mail:</strong>{' '}
                  <a
                    href="mailto:contato@cerbeleraoliveira.adv.br"
                    className="text-primary-600 underline hover:text-primary-800"
                  >
                    contato@cerbeleraoliveira.adv.br
                  </a>
                </li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                11. Alterações desta Política
              </h2>
              <p className="text-secondary-600 mb-6">
                Reservamo-nos o direito de alterar esta Política de Privacidade a
                qualquer momento, mediante publicação da versão atualizada neste
                site. Recomendamos a consulta periódica desta página.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
