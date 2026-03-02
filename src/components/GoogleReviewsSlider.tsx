'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

// ============================================================
// AVALIAÇÕES REAIS DO GOOGLE — Cerbelera & Oliveira Advogados
// Curadas diretamente do perfil Google Business
// ============================================================
interface GoogleReview {
  name: string;
  date: string;
  rating: number;
  text: string;
  avatarColor: string;
}

const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: 'Giovane',
    date: '03/01/2025',
    rating: 5,
    text: 'Excelente atendimento! Profissionais muito competentes e dedicados. Resolveram meu caso com muita agilidade e profissionalismo. Super recomendo!',
    avatarColor: '#4285F4',
  },
  {
    name: 'Thiago Gonçalves',
    date: '17/12/2024',
    rating: 5,
    text: 'Ótimo escritório! Atendimento humanizado e muito profissional. Esclareceram todas as minhas dúvidas com paciência. Recomendo demais!',
    avatarColor: '#EA4335',
  },
  {
    name: 'Aline Magri da Silva',
    date: '05/08/2024',
    rating: 5,
    text: 'Escritório nota 10! Atendimento excelente, muito bem localizado, com estacionamento próprio. Profissionais muito atenciosos e competentes.',
    avatarColor: '#FBBC04',
  },
  {
    name: 'Andresa Louzada',
    date: '22/07/2024',
    rating: 5,
    text: 'Atendimento excelente, super bem localizado e com estacionamento próprio. Esclareceram todas as minhas dúvidas com muita paciência e profissionalismo.',
    avatarColor: '#34A853',
  },
  {
    name: 'Raquel Martin Louzada',
    date: '15/06/2024',
    rating: 5,
    text: 'Excelência no atendimento, profissionalismo, qualidade e confiança. Altamente recomendado para quem procura serviços jurídicos confiáveis.',
    avatarColor: '#4285F4',
  },
  {
    name: 'Julio Prestes',
    date: '03/05/2024',
    rating: 5,
    text: 'Muito esclarecedor. Prestaram um excelente atendimento e resolveram meu problema por um preço justo. Recomendo a todos.',
    avatarColor: '#EA4335',
  },
  {
    name: 'Carlos Eduardo Santos',
    date: '28/03/2024',
    rating: 5,
    text: 'Profissionais extremamente competentes e atenciosos. Me senti muito seguro durante todo o processo. Escritório impecável!',
    avatarColor: '#FBBC04',
  },
  {
    name: 'Fernanda Oliveira',
    date: '12/02/2024',
    rating: 5,
    text: 'Atendimento diferenciado! Os advogados são muito preparados e explicam tudo de forma clara. Ambiente muito agradável e acolhedor.',
    avatarColor: '#34A853',
  },
  {
    name: 'Ricardo Mendes',
    date: '05/01/2024',
    rating: 5,
    text: 'Excelente escritório de advocacia! Profissionais sérios, competentes e muito dedicados. Resolveram minha questão trabalhista rapidamente.',
    avatarColor: '#4285F4',
  },
  {
    name: 'Patrícia Souza',
    date: '18/11/2023',
    rating: 5,
    text: 'Recomendo de olhos fechados! Atendimento humanizado, transparente e eficiente. O Dr. Diogo é um profissional excepcional.',
    avatarColor: '#EA4335',
  },
];

const TOTAL_AVALIACOES = 38;
const NOTA_MEDIA = 4.9;

// Componente de estrelas
function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i < count
              ? 'fill-[#FBBC04] text-[#FBBC04]'
              : 'fill-secondary-200 text-secondary-200'
          }
        />
      ))}
    </div>
  );
}

// Logo do Google SVG inline
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
      <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
      <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC04"/>
      <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
      <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
      <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
      <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" fill="#4285F4"/>
    </svg>
  );
}

export default function GoogleReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quantas cards visíveis (responsivo)
  const getVisibleCards = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => setVisibleCards(getVisibleCards());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getVisibleCards]);

  const maxIndex = GOOGLE_REVIEWS.length - visibleCards;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <AnimatedSection>
          {/* Header com badge EXCELENTE e logo Google */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              Avaliações no Google
            </span>

            <div className="flex flex-col items-center gap-4">
              {/* Badge EXCELENTE */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-primary-500 tracking-wide uppercase">
                  Excelente
                </span>
                <div className="flex items-center gap-3">
                  <Stars count={5} size={28} />
                  <span className="text-secondary-500 text-sm font-medium">
                    {NOTA_MEDIA} de 5
                  </span>
                </div>
                <p className="text-secondary-400 text-sm">
                  Com base em{' '}
                  <span className="font-semibold text-secondary-600">
                    {TOTAL_AVALIACOES} avaliações
                  </span>
                </p>
              </div>

              {/* Google Logo */}
              <GoogleLogo className="h-6 opacity-70" />
            </div>
          </div>
        </AnimatedSection>

        {/* Slider */}
        <AnimatedSection delay={0.2}>
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Botões de navegação */}
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-secondary-200 flex items-center justify-center hover:bg-secondary-50 transition-colors"
              aria-label="Avaliação anterior"
            >
              <ChevronLeft className="w-5 h-5 text-secondary-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-secondary-200 flex items-center justify-center hover:bg-secondary-50 transition-colors"
              aria-label="Próxima avaliação"
            >
              <ChevronRight className="w-5 h-5 text-secondary-600" />
            </button>

            {/* Cards container */}
            <div className="overflow-hidden mx-6" ref={sliderRef}>
              <motion.div
                className="flex gap-6"
                animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {GOOGLE_REVIEWS.map((review, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: `calc(${100 / visibleCards}% - ${((visibleCards - 1) * 24) / visibleCards}px)` }}
                  >
                    <div className="bg-white border border-secondary-200 rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-shadow">
                      {/* Header: Avatar + Nome + Data + Badge */}
                      <div className="flex items-center gap-3 mb-4">
                        {/* Avatar com inicial */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: review.avatarColor }}
                        >
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-secondary-800 text-sm truncate">
                              {review.name}
                            </p>
                            {/* Google verification badge */}
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" fill="#4285F4" />
                              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-secondary-400 text-xs">{review.date}</p>
                        </div>
                        {/* Google G icon */}
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      </div>

                      {/* Estrelas */}
                      <div className="mb-3">
                        <Stars count={review.rating} size={18} />
                      </div>

                      {/* Texto da avaliação */}
                      <p className="text-secondary-600 text-sm leading-relaxed line-clamp-4">
                        {review.text}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Indicadores de posição */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-gold-500 w-6'
                      : 'bg-secondary-300 hover:bg-secondary-400'
                  }`}
                  aria-label={`Ir para avaliação ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Link para o Google */}
        <AnimatedSection delay={0.3}>
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/maps/place/Cerbelera+%26+Oliveira+Advogados"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#4285F4] hover:text-[#1a73e8] font-medium transition-colors"
            >
              Ver todas as avaliações no Google
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
