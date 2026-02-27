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
                pelo escritório Cerbelera & Oliveira Advogados Associados,
                registrado sob CNPJ correspondente, com sede em Presidente
                Prudente/SP.
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
                3. Finalidade dos Dados
              </h2>
              <p className="text-secondary-600 mb-4">
                Os dados coletados são utilizados para:
              </p>
              <ul className="list-disc list-inside text-secondary-600 mb-6 space-y-2">
                <li>Responder solicitações de contato</li>
                <li>Agendar consultas e atendimentos</li>
                <li>Melhorar a experiência de navegação no site</li>
                <li>Enviar comunicações relevantes (mediante consentimento)</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-secondary-600 mb-6">
                O escritório <strong>não compartilha, vende ou aluga</strong>{' '}
                dados pessoais dos usuários a terceiros, exceto quando
                necessário para cumprimento de obrigações legais ou mediante
                consentimento expresso do titular dos dados.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                5. Segurança dos Dados
              </h2>
              <p className="text-secondary-600 mb-6">
                Adotamos medidas de segurança técnicas e administrativas aptas a
                proteger os dados pessoais contra acessos não autorizados,
                destruição, perda, alteração ou qualquer forma de tratamento
                inadequado. Utilizamos protocolos de segurança como HTTPS/SSL
                para proteger as informações transmitidas.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                6. Cookies
              </h2>
              <p className="text-secondary-600 mb-6">
                Este site utiliza cookies para melhorar a experiência de
                navegação. Os cookies são pequenos arquivos armazenados no
                dispositivo do usuário que permitem personalizar o conteúdo e
                analisar o tráfego do site. O usuário pode gerenciar ou
                desativar os cookies nas configurações do seu navegador.
              </p>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                7. Direitos do Titular (LGPD)
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
                8. Contato
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
                  <strong>E-mail:</strong> contato@cerbeleraoliveira.adv.br
                </li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 mt-10">
                9. Alterações desta Política
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
