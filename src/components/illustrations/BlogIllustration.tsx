'use client';

interface BlogIllustrationProps {
  category: string;
  className?: string;
}

const categoryConfig: Record<string, { gradient: string[]; icon: JSX.Element }> = {
  'Direito Trabalhista': {
    gradient: ['#059669', '#10b981'],
    icon: (
      <g>
        {/* Briefcase */}
        <rect x="28" y="42" width="44" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M38 42V36a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="28" y1="54" x2="72" y2="54" stroke="currentColor" strokeWidth="2" />
        <rect x="44" y="50" width="12" height="8" rx="2" fill="currentColor" opacity="0.3" />
      </g>
    ),
  },
  'Direito de Família': {
    gradient: ['#e11d48', '#f43f5e'],
    icon: (
      <g>
        {/* Family / Heart */}
        <path d="M50 68C50 68 30 52 30 42a10 10 0 0 1 20-2 10 10 0 0 1 20 2c0 10-20 26-20 26z" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2.5" />
      </g>
    ),
  },
  'Direito Civil': {
    gradient: ['#2563eb', '#3b82f6'],
    icon: (
      <g>
        {/* Scale / Balance */}
        <line x1="50" y1="28" x2="50" y2="72" stroke="currentColor" strokeWidth="2.5" />
        <line x1="32" y1="40" x2="68" y2="40" stroke="currentColor" strokeWidth="2.5" />
        <path d="M32 40L26 56h12z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
        <path d="M68 40L62 56h12z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
        <rect x="44" y="70" width="12" height="4" rx="2" fill="currentColor" />
      </g>
    ),
  },
  'Direito Previdenciário': {
    gradient: ['#d97706', '#f59e0b'],
    icon: (
      <g>
        {/* Shield with check */}
        <path d="M50 26L30 36v14c0 14 8.5 22 20 28 11.5-6 20-14 20-28V36z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <polyline points="40,52 47,60 62,44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
  },
  'Direito do Consumidor': {
    gradient: ['#7c3aed', '#8b5cf6'],
    icon: (
      <g>
        {/* Shield with star */}
        <path d="M50 26L30 36v14c0 14 8.5 22 20 28 11.5-6 20-14 20-28V36z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M50 38l3.5 7 7.5 1-5.5 5.3 1.3 7.7L50 55l-6.8 4 1.3-7.7L39 46l7.5-1z" fill="currentColor" opacity="0.4" />
      </g>
    ),
  },
  'Direito Imobiliário': {
    gradient: ['#0891b2', '#06b6d4'],
    icon: (
      <g>
        {/* Building */}
        <rect x="32" y="40" width="36" height="34" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M28 42L50 26l22 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="44" y="56" width="12" height="18" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="36" y="46" width="8" height="6" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="56" y="46" width="8" height="6" rx="1" fill="currentColor" opacity="0.25" />
      </g>
    ),
  },
};

const defaultConfig = {
  gradient: ['#1e3a5f', '#2563eb'],
  icon: (
    <g>
      <circle cx="50" cy="40" r="12" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
      <rect x="36" y="58" width="28" height="16" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
    </g>
  ),
};

export default function BlogIllustration({ category, className = '' }: BlogIllustrationProps) {
  const config = categoryConfig[category] || defaultConfig;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`blog-bg-${category.replace(/\s/g, '')}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={config.gradient[0]} />
            <stop offset="100%" stopColor={config.gradient[1]} />
          </linearGradient>
          <pattern id={`blog-dots-${category.replace(/\s/g, '')}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="white" opacity="0.1" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill={`url(#blog-bg-${category.replace(/\s/g, '')})`} />
        <rect width="100" height="100" fill={`url(#blog-dots-${category.replace(/\s/g, '')})`} />

        {/* Decorative circles */}
        <circle cx="85" cy="15" r="20" fill="white" opacity="0.06" />
        <circle cx="10" cy="85" r="25" fill="white" opacity="0.04" />
        <circle cx="90" cy="80" r="12" fill="white" opacity="0.05" />

        {/* Decorative lines */}
        <line x1="0" y1="88" x2="100" y2="88" stroke="white" strokeWidth="0.5" opacity="0.1" />
        <line x1="0" y1="92" x2="100" y2="92" stroke="white" strokeWidth="0.3" opacity="0.08" />

        {/* Icon */}
        <g color="white">
          {config.icon}
        </g>

        {/* RS monogram watermark */}
        <text
          x="82"
          y="22"
          fill="white"
          opacity="0.08"
          fontSize="14"
          fontFamily="serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          RS
        </text>
      </svg>
    </div>
  );
}
