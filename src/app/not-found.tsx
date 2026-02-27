import Link from 'next/link';
import { Home, ArrowLeft, Scale } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f]">
      <div className="container-custom text-center">
        <Scale className="w-16 h-16 text-gold-400 mx-auto mb-6" />
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-200 mb-6">
          Página Não Encontrada
        </h2>
        <p className="text-primary-300 text-lg max-w-md mx-auto mb-8">
          A página que você procura não existe ou foi movida. Verifique o
          endereço ou retorne à página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gold">
            <Home className="w-5 h-5 mr-2" />
            Página Inicial
          </Link>
          <Link
            href="/contato"
            className="btn-outline border-primary-300 text-primary-100 hover:bg-primary-100/10 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Fale Conosco
          </Link>
        </div>
      </div>
    </section>
  );
}
