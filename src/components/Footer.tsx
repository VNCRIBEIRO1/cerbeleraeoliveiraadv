import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import CanvasLogo from './CanvasLogo';

const areas = [
  'Direito Civil',
  'Direito Trabalhista',
  'Direito Criminal',
  'Direito Empresarial',
  'Direito Administrativo',
  'Cálculos Judiciais',
];

const links = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Áreas de Atuação', href: '/areas-de-atuacao' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '/contato' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0e1810] to-[#050905] text-primary-100">
      {/* Conteúdo principal */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CanvasLogo
                src="/images/cerbelera_oliveira_logo_cover.webp"
                alt="Cerbelera & Oliveira"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <div>
                <h3 className="text-white font-serif font-bold text-lg">
                  Cerbelera & Oliveira
                </h3>
                <p className="text-xs tracking-wider uppercase text-primary-300">
                  Advogados Associados
                </p>
              </div>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed mb-4">
              Escritório de advocacia comprometido com a excelência e a ética
              profissional, oferecendo atuação estratégica e humanizada em
              Presidente Prudente e região.
            </p>
            <p className="text-gold-400 text-sm font-medium">OAB/SP</p>
          </div>

          {/* Coluna 2 - Links */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Navegação
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Áreas */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Áreas de Atuação
            </h4>
            <ul className="space-y-3">
              {areas.map((area) => (
                <li key={area}>
                  <Link
                    href="/areas-de-atuacao"
                    className="text-primary-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-sm">
                  R. Francisco Machado de Campos, 393
                  <br />
                  Vila Nova
                  <br />
                  Presidente Prudente - SP
                  <br />
                  CEP 19010-300
                </span>
              </li>
              <li>
                <a
                  href="tel:+5518996101884"
                  className="flex items-center gap-3 text-primary-300 hover:text-gold-400 transition-colors text-sm"
                >
                  <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  (18) 99610-1884
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@cerbeleraoliveira.adv.br"
                  className="flex items-center gap-3 text-primary-300 hover:text-gold-400 transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  contato@cerbeleraoliveira.adv.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-300 text-sm">
                  Seg a Sex, 08:00 às 18:00
                </span>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/cerbelera.oliveira.adv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-gold-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/cerbeleraoliveira.adv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-gold-400 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-primary-700/30">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Cerbelera & Oliveira Advogados
            Associados. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/politica-privacidade"
              className="text-primary-400 hover:text-gold-400 text-xs transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="text-primary-400 hover:text-gold-400 text-xs transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
          <p className="text-primary-500 text-xs">
            Este site tem caráter informativo, nos termos do Provimento 205/2021
            da OAB.
          </p>
        </div>
      </div>
    </footer>
  );
}
