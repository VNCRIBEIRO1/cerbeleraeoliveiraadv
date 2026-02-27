'use client';

interface LawyerPortraitProps {
  className?: string;
  name?: string;
  subtitle?: string;
}

export default function LawyerPortrait({
  className = '',
  name = 'Cerbelera & Oliveira',
  subtitle = 'Advogados Associados',
}: LawyerPortraitProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label={`${name} - ${subtitle}`}
      >
        <defs>
          <linearGradient id="portrait-bg" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#1a2e1f" />
            <stop offset="50%" stopColor="#0e1810" />
            <stop offset="100%" stopColor="#0a110b" />
          </linearGradient>
          <linearGradient id="suit-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1e" />
          </linearGradient>
          <linearGradient id="shirt-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="skin-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#deb887" />
            <stop offset="100%" stopColor="#d2a679" />
          </linearGradient>
          <linearGradient id="tie-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#1a2e1f" />
            <stop offset="100%" stopColor="#0e1810" />
          </linearGradient>
          <linearGradient id="gold-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#b8942e" />
          </linearGradient>
          <clipPath id="portrait-clip">
            <rect width="400" height="500" rx="16" />
          </clipPath>
          <pattern id="portrait-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="white" opacity="0.03" />
          </pattern>
        </defs>

        <g clipPath="url(#portrait-clip)">
          {/* Background */}
          <rect width="400" height="500" fill="url(#portrait-bg)" />
          <rect width="400" height="500" fill="url(#portrait-pattern)" />

          {/* Ambient light */}
          <ellipse cx="200" cy="120" rx="180" ry="120" fill="white" opacity="0.03" />
          <ellipse cx="320" cy="80" rx="120" ry="80" fill="#d4a853" opacity="0.03" />

          {/* Body / Suit */}
          <path
            d="M100 500 L100 340 Q100 300 140 280 L170 268 L200 310 L230 268 L260 280 Q300 300 300 340 L300 500 Z"
            fill="url(#suit-gradient)"
          />
          {/* Suit lapels */}
          <path
            d="M170 268 L185 310 L200 340 L200 310 Z"
            fill="#242440"
          />
          <path
            d="M230 268 L215 310 L200 340 L200 310 Z"
            fill="#242440"
          />
          {/* Suit shadow lines */}
          <line x1="155" y1="290" x2="140" y2="500" stroke="#0a0a16" strokeWidth="1" opacity="0.3" />
          <line x1="245" y1="290" x2="260" y2="500" stroke="#0a0a16" strokeWidth="1" opacity="0.3" />

          {/* Shirt */}
          <path
            d="M185 268 L185 340 L200 380 L215 340 L215 268 L200 310 Z"
            fill="url(#shirt-gradient)"
          />
          {/* Shirt buttons */}
          <circle cx="200" cy="330" r="2.5" fill="#cbd5e1" />
          <circle cx="200" cy="350" r="2.5" fill="#cbd5e1" />
          <circle cx="200" cy="370" r="2.5" fill="#cbd5e1" />

          {/* Tie */}
          <path
            d="M195 270 L200 268 L205 270 L204 330 L200 345 L196 330 Z"
            fill="url(#tie-gradient)"
          />
          <path
            d="M196 285 L204 285 L203 290 L197 290 Z"
            fill="#d4a853"
            opacity="0.6"
          />

          {/* Neck */}
          <rect x="185" y="230" width="30" height="44" rx="12" fill="url(#skin-gradient)" />

          {/* Head */}
          <ellipse cx="200" cy="180" rx="56" ry="68" fill="url(#skin-gradient)" />

          {/* Ears */}
          <ellipse cx="144" cy="185" rx="10" ry="16" fill="#d2a679" />
          <ellipse cx="144" cy="185" rx="6" ry="10" fill="#c9976d" opacity="0.5" />
          <ellipse cx="256" cy="185" rx="10" ry="16" fill="#d2a679" />
          <ellipse cx="256" cy="185" rx="6" ry="10" fill="#c9976d" opacity="0.5" />

          {/* Hair */}
          <path
            d="M145 160 Q145 115 200 110 Q255 115 255 160 L255 140 Q255 105 200 98 Q145 105 145 140 Z"
            fill="#2c1810"
          />
          <path
            d="M145 160 Q145 145 150 140"
            fill="none"
            stroke="#2c1810"
            strokeWidth="8"
          />
          <path
            d="M255 160 Q255 145 250 140"
            fill="none"
            stroke="#2c1810"
            strokeWidth="8"
          />

          {/* Eyebrows */}
          <path d="M170 162 Q180 156 192 160" stroke="#2c1810" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M208 160 Q220 156 230 162" stroke="#2c1810" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="181" cy="175" rx="10" ry="7" fill="white" />
          <ellipse cx="219" cy="175" rx="10" ry="7" fill="white" />
          <circle cx="183" cy="175" r="5" fill="#3b2010" />
          <circle cx="221" cy="175" r="5" fill="#3b2010" />
          <circle cx="184" cy="174" r="2" fill="white" />
          <circle cx="222" cy="174" r="2" fill="white" />

          {/* Nose */}
          <path d="M197 178 Q200 195 203 178" stroke="#c9976d" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          <path d="M186 208 Q193 216 200 214 Q207 216 214 208" stroke="#b07a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Jaw line shadow */}
          <path
            d="M148 200 Q155 245 200 250 Q245 245 252 200"
            fill="none"
            stroke="#c49570"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Suit pocket square (gold) */}
          <path
            d="M130 310 Q130 300 140 300 Q135 308 138 316 Z"
            fill="url(#gold-accent)"
            opacity="0.8"
          />

          {/* Gold scale badge on lapel */}
          <g transform="translate(263, 300) scale(0.5)">
            <circle cx="0" cy="0" r="16" fill="url(#gold-accent)" opacity="0.9" />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="white" strokeWidth="1.5" />
            <line x1="-8" y1="-3" x2="8" y2="-3" stroke="white" strokeWidth="1.5" />
            <path d="M-8 -3 L-11 5 h6 z" fill="white" opacity="0.7" />
            <path d="M8 -3 L5 5 h6 z" fill="white" opacity="0.7" />
          </g>

          {/* Name plate at bottom */}
          <rect x="80" y="430" width="240" height="50" rx="8" fill="white" opacity="0.08" />
          <text
            x="200"
            y="452"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            letterSpacing="1"
          >
            {name}
          </text>
          <text
            x="200"
            y="472"
            textAnchor="middle"
            fill="#d4a853"
            fontSize="12"
            fontFamily="system-ui, sans-serif"
            letterSpacing="3"
          >
            {subtitle.toUpperCase()}
          </text>

          {/* Subtle frame */}
          <rect
            x="6"
            y="6"
            width="388"
            height="488"
            rx="12"
            fill="none"
            stroke="url(#gold-accent)"
            strokeWidth="1"
            opacity="0.15"
          />
        </g>
      </svg>
    </div>
  );
}
