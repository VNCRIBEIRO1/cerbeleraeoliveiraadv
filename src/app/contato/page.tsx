import type { Metadata } from 'next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Scale,
  MessageCircle,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeader from '@/components/SectionHeader';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com Cerbelera & Oliveira Advogados Associados em Presidente Prudente. Agende uma consulta.',
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Endereço',
    lines: [
      'R. Francisco Machado de Campos, 393',
      'Vila Nova',
      'Presidente Prudente - SP',
      'CEP 19010-300',
    ],
  },
  {
    icon: Phone,
    title: 'Telefone / WhatsApp',
    lines: ['(18) 99610-1884'],
    href: 'tel:+5518996101884',
  },
  {
    icon: Mail,
    title: 'E-mail',
    lines: ['contato@cerbeleraoliveira.adv.br'],
    href: 'mailto:contato@cerbeleraoliveira.adv.br',
  },
  {
    icon: Clock,
    title: 'Horário',
    lines: ['Segunda a Sexta', '08:00 às 18:00'],
  },
];

export default function ContatoPage() {
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
              <MessageCircle className="w-4 h-4" />
              Fale Conosco
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Entre em <span className="text-gold-400">Contato</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl">
              Estamos prontos para esclarecer suas dúvidas com ética e
              profissionalismo. Contamos com estacionamento próprio para sua
              comodidade.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={info.title} delay={index * 0.1}>
                <div className="card p-6 text-center h-full border border-secondary-100">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-7 h-7 text-primary-500" />
                  </div>
                  <h3 className="font-serif font-bold text-primary-500 mb-3">
                    {info.title}
                  </h3>
                  {info.lines.map((line) => (
                    <p key={line} className="text-secondary-600 text-sm">
                      {info.href ? (
                        <a
                          href={info.href}
                          className="hover:text-gold-500 transition-colors"
                        >
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Formulário e Mapa */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <AnimatedSection>
              <div className="card p-8 border border-secondary-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-primary-500">
                      Envie uma Mensagem
                    </h2>
                    <p className="text-secondary-500 text-sm">
                      Responderemos em até 24 horas úteis
                    </p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </AnimatedSection>

            {/* Mapa */}
            <AnimatedSection delay={0.2}>
              <div className="card border border-secondary-100 overflow-hidden h-full">
                <div className="h-full min-h-[500px] bg-secondary-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">
                      Nossa Localização
                    </h3>
                    <p className="text-secondary-500 text-sm mb-2">
                      R. Francisco Machado de Campos, 393
                      <br />
                      Vila Nova
                      <br />
                      Presidente Prudente - SP
                    </p>
                    <p className="text-gold-500 text-sm font-medium mb-4">
                      🅿️ Estacionamento Próprio
                    </p>
                    <a
                      href="https://maps.google.com/?q=R.+Francisco+Machado+de+Campos,+393+-+Vila+Nova,+Presidente+Prudente+-+SP,+19010-300"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Aviso Legal */}
      <section className="py-10 bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <Scale className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
            <p className="text-secondary-600 text-sm">
              <strong>Aviso Legal:</strong> O envio de mensagem por este
              formulário não estabelece relação advogado-cliente. As informações
              enviadas serão tratadas com confidencialidade e em conformidade com
              a LGPD (Lei nº 13.709/2018). Este site tem caráter meramente
              informativo, nos termos do Provimento 205/2021 da OAB.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
