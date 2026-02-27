'use client';

interface ScaleIllustrationProps {
  className?: string;
}

export default function ScaleIllustration({ className = '' }: ScaleIllustrationProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="scale-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#b8942e" />
          </linearGradient>
          <linearGradient id="scale-light" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="160" cy="160" r="150" fill="none" stroke="white" strokeWidth="1" opacity="0.08" />
        <circle cx="160" cy="160" r="130" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06" />

        {/* Radial lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 160 + 125 * Math.cos(angle);
          const y1 = 160 + 125 * Math.sin(angle);
          const x2 = 160 + 150 * Math.cos(angle);
          const y2 = 160 + 150 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.06"
            />
          );
        })}

        {/* Central pillar */}
        <rect x="155" y="80" width="10" height="180" rx="5" fill="url(#scale-gold)" opacity="0.7" />

        {/* Base */}
        <rect x="115" y="250" width="90" height="12" rx="6" fill="url(#scale-gold)" opacity="0.6" />
        <ellipse cx="160" cy="256" rx="55" ry="4" fill="white" opacity="0.05" />

        {/* Beam */}
        <rect x="60" y="94" width="200" height="8" rx="4" fill="url(#scale-gold)" opacity="0.65" />

        {/* Top ornament */}
        <circle cx="160" cy="80" r="15" fill="url(#scale-gold)" opacity="0.6" />
        <circle cx="160" cy="80" r="9" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />

        {/* Left chain */}
        <line x1="80" y1="102" x2="80" y2="160" stroke="url(#scale-gold)" strokeWidth="2.5" opacity="0.5" />
        <circle cx="80" cy="105" r="3" fill="url(#scale-gold)" opacity="0.6" />
        {/* Left pan */}
        <path
          d="M45 160 L80 145 L115 160 Z"
          fill="white"
          opacity="0.08"
          stroke="url(#scale-gold)"
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        <ellipse cx="80" cy="162" rx="38" ry="8" fill="url(#scale-gold)" opacity="0.25" />
        <ellipse cx="80" cy="162" rx="32" ry="6" fill="white" opacity="0.05" />

        {/* Right chain */}
        <line x1="240" y1="102" x2="240" y2="172" stroke="url(#scale-gold)" strokeWidth="2.5" opacity="0.5" />
        <circle cx="240" cy="105" r="3" fill="url(#scale-gold)" opacity="0.6" />
        {/* Right pan */}
        <path
          d="M205 172 L240 157 L275 172 Z"
          fill="white"
          opacity="0.08"
          stroke="url(#scale-gold)"
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        <ellipse cx="240" cy="174" rx="38" ry="8" fill="url(#scale-gold)" opacity="0.25" />
        <ellipse cx="240" cy="174" rx="32" ry="6" fill="white" opacity="0.05" />

        {/* Floating particles */}
        <circle cx="60" cy="50" r="2" fill="white" opacity="0.1" />
        <circle cx="270" cy="40" r="1.5" fill="#d4a853" opacity="0.15" />
        <circle cx="40" cy="200" r="1.5" fill="white" opacity="0.08" />
        <circle cx="290" cy="230" r="2" fill="#d4a853" opacity="0.1" />
        <circle cx="130" cy="30" r="1" fill="white" opacity="0.1" />
        <circle cx="250" cy="280" r="1.5" fill="white" opacity="0.06" />
      </svg>
    </div>
  );
}
