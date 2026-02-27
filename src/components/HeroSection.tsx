'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Scale, Shield, Users } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] overflow-hidden">
      {/* Background Photo - Estátua da Justiça */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero}
          alt="Justiça"
          fill
          className="object-cover opacity-[0.12]"
          priority
          sizes="100vw"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Advocacia Estratégica e Humanizada
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Atuação Estratégica na{' '}
              <span className="text-gold-400">Defesa</span> dos Seus{' '}
              <span className="text-gold-400">Direitos</span>
            </h1>

            <p className="text-lg text-primary-200 leading-relaxed mb-8 max-w-lg">
              Cerbelera & Oliveira Advogados Associados — Escritório em
              Presidente Prudente, SP. Atuação ética e humanizada nas áreas de
              Direito Trabalhista, Criminal, Civil, Empresarial e
              Administrativo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contato" className="btn-gold text-base">
                Agende uma Consulta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/areas-de-atuacao"
                className="btn-outline border-primary-300 text-primary-100 hover:bg-primary-100/10 hover:text-white text-base"
              >
                Conheça Nossas Áreas
              </Link>
            </div>

            <p className="text-primary-400 text-xs mt-6">
              OAB/SP • Este site tem caráter meramente informativo.
            </p>
          </motion.div>

          {/* Cards de destaque */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:grid grid-cols-1 gap-6"
          >
            {[
              {
                icon: Shield,
                title: 'Compromisso Ético',
                desc: 'Atuação em conformidade com o Código de Ética da OAB e o Provimento 205/2021.',
              },
              {
                icon: Users,
                title: 'Atendimento Humanizado',
                desc: 'Cada caso é tratado com dedicação, atenção e respeito à individualidade do cliente.',
              },
              {
                icon: Scale,
                title: 'Experiência Comprovada',
                desc: 'Mais de 5 anos de atuação em diversas áreas do Direito, com 5.0 de avaliação no Google.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif font-bold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-primary-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
