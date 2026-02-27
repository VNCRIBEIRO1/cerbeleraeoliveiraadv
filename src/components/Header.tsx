'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import CanvasLogo from './CanvasLogo';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Áreas de Atuação', href: '/areas-de-atuacao' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '/contato' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-r from-[#0a110b] via-[#121f14] to-[#0a110b] shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-gold-500/20'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent'
      }`}
    >
      {/* Barra superior dourada elegante */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="bg-gradient-to-r from-gold-700/90 via-gold-500/90 to-gold-700/90 backdrop-blur-sm">
          <div className="container-custom py-1.5 flex justify-between items-center text-xs">
            <span className="text-white/90 font-medium tracking-wide">
              OAB/SP • Advocacia Estratégica e Humanizada
            </span>
            <a
              href="tel:+5518996101884"
              className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors font-medium"
            >
              <Phone className="w-3 h-3" />
              (18) 99610-1884
            </a>
          </div>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-14 w-auto">
              <CanvasLogo
                src="/images/cerbelera_oliveira_logo_cover.webp"
                alt="Cerbelera & Oliveira Advogados"
                width={200}
                height={56}
                className={`object-contain h-14 w-auto transition-all duration-500 ${
                  scrolled
                    ? 'brightness-0 invert drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]'
                    : 'brightness-0 invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                }`}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 text-white/90 hover:text-gold-400 hover:bg-white/5 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
            <Link
              href="/contato"
              className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 hover:-translate-y-0.5"
            >
              Fale Conosco
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Linha dourada decorativa inferior */}
      {scrolled && (
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gradient-to-b from-[#0e1810] to-[#0a110b] border-t border-gold-500/20"
          >
            <div className="container-custom py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-white/80 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contato"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 mt-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-center rounded-lg font-semibold text-sm shadow-lg"
              >
                Fale Conosco
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
