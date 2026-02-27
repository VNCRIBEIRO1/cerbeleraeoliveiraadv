'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-primary-900/90 backdrop-blur-sm'
      }`}
    >
      {/* Barra superior com contato */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
        }`}
      >
        <div className="container-custom py-2 flex justify-between items-center text-sm text-primary-100">
          <span className="flex items-center gap-1">
            OAB/SP
          </span>
          <a
            href="tel:+5518996101884"
            className="flex items-center gap-1 hover:text-gold-400 transition-colors"
          >
            <Phone className="w-3 h-3" />
            (18) 99610-1884
          </a>
        </div>
        <div className="border-b border-primary-700/30" />
      </div>

      {/* Navegação principal */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-auto">
              <Image
                src={scrolled ? '/images/logo-cerbelera-oliveira.png' : '/images/logo-cerbelera-oliveira.png'}
                alt="Cerbelera & Oliveira Advogados"
                width={180}
                height={48}
                className={`object-contain h-12 w-auto transition-all ${
                  scrolled ? '' : 'brightness-0 invert'
                }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gold-500 relative group ${
                  scrolled ? 'text-secondary-700' : 'text-primary-100'
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link href="/contato" className="btn-gold text-sm py-2 px-4">
              Fale Conosco
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
          >
            {isOpen ? (
              <X
                className={`w-6 h-6 ${
                  scrolled ? 'text-primary-500' : 'text-white'
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  scrolled ? 'text-primary-500' : 'text-white'
                }`}
              />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-xl"
          >
            <div className="container-custom py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contato"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 bg-gold-500 text-white text-center rounded-lg font-medium"
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
