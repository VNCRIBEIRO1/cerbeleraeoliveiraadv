import type { Metadata } from 'next';
import { Calendar, Phone, MessageCircle, CheckCircle2, Clock, MapPin, Mail, Scale } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeader from '@/components/SectionHeader';
import AgendamentoClient from './AgendamentoClient';
import EmailFormClient from './EmailFormClient';

export const metadata: Metadata = {
  title: 'Agende sua Consulta',
  description: 'Agende sua consulta com Cerbelera & Oliveira Advogados Associados. Atendimento humanizado e personalizado em Presidente Prudente.',
};

export default function AgendamentoPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6 mx-auto">
              <Calendar className="w-4 h-4" />
              Agendamento de Consultas
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Agende sua <span className="text-gold-400">Consulta</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto">
              Escolha a forma mais prática para você agendar. Nosso atendimento é humanizado e personalizado.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Card 1 - Agendamento Online */}
            <AnimatedSection>
              <div className="relative card p-8 h-full border-2 border-gold-200 hover:border-gold-400 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ⭐ Recomendado
                  </span>
                </div>
                <div className="w-14 h-14 bg-gold-50 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-gold-500" />
                </div>
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-3">
                  Agendar pelo Assistente Virtual
                </h2>
                <p className="text-secondary-600 text-sm mb-6">
                  Use nosso assistente inteligente para escolher a data, horário e tipo de consulta. Veja em tempo real os horários disponíveis e confirme pelo WhatsApp.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Escolha tipo de consulta',
                    'Calendário com datas disponíveis',
                    'Horários livres em tempo real',
                    'Confirmação via WhatsApp',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span className="text-sm text-secondary-700">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#agendar-online"
                  className="btn-gold w-full text-center flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Iniciar Agendamento Online
                </a>
              </div>
            </AnimatedSection>

            {/* Card 2 - Ligar/WhatsApp */}
            <AnimatedSection delay={0.15}>
              <div className="card p-8 h-full border border-secondary-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-primary-500" />
                </div>
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-3">
                  Ligar ou WhatsApp
                </h2>
                <p className="text-secondary-600 text-sm mb-6">
                  Prefere falar diretamente? Ligue ou envie mensagem pelo WhatsApp para nossa secretária. Atendimento rápido e carinhoso.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Atendimento humano',
                    'Tira dúvidas na hora',
                    'Horário comercial',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-secondary-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <a href="https://wa.me/5518996101884?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta."
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a href="tel:+5518996101884"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-secondary-200 text-secondary-700 rounded-xl font-medium hover:border-primary-300 hover:text-primary-500 transition-colors">
                    <Phone className="w-5 h-5" />
                    (18) 99610-1884
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Formulário de Agendamento Online */}
          <div id="agendar-online" className="scroll-mt-24">
            <AnimatedSection>
              <AgendamentoClient />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Formulário de E-mail Alternativo */}
      <section className="py-16 bg-secondary-50" id="formulario-email">
        <div className="container-custom max-w-2xl">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Mail className="w-4 h-4" />
                Formulário de Contato
              </span>
              <h2 className="text-3xl font-serif font-bold text-primary-500 mb-3">
                Prefere enviar por <span className="text-gold-500">E-mail</span>?
              </h2>
              <p className="text-secondary-600">
                Preencha o formulário abaixo e responderemos em até 24 horas úteis.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="card p-8 border border-secondary-100">
              <EmailFormClient />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Info extra */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-serif font-bold text-primary-500 text-sm mb-1">Endereço</h3>
                <p className="text-secondary-600 text-xs">R. Francisco Machado de Campos, 393<br />Vila Nova - Presidente Prudente/SP</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-serif font-bold text-primary-500 text-sm mb-1">Horário</h3>
                <p className="text-secondary-600 text-xs">Segunda a Sexta<br />08:00 às 18:00</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Scale className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-serif font-bold text-primary-500 text-sm mb-1">Estacionamento</h3>
                <p className="text-secondary-600 text-xs">🅿️ Estacionamento próprio<br />para sua comodidade</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Aviso Legal */}
      <section className="py-8 bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <Scale className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
            <p className="text-secondary-600 text-xs">
              <strong>Aviso Legal:</strong> O agendamento por este formulário não estabelece relação advogado-cliente. As informações enviadas serão tratadas com confidencialidade e em conformidade com a LGPD (Lei nº 13.709/2018). Este site tem caráter meramente informativo, nos termos do Provimento 205/2021 da OAB.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
