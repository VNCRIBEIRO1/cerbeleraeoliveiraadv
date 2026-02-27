'use client';

interface AreaIllustrationProps {
  areaName: string;
  colorFrom: string;
  colorTo: string;
  className?: string;
}

const areaIcons: Record<string, JSX.Element> = {
  'Direito Civil': (
    <g>
      {/* Scale of justice */}
      <line x1="100" y1="30" x2="100" y2="140" stroke="white" strokeWidth="4" />
      <line x1="55" y1="55" x2="145" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <rect x="88" y="135" width="24" height="8" rx="4" fill="white" opacity="0.9" />
      {/* Left pan */}
      <path d="M55 55L40 95h30z" fill="white" opacity="0.2" stroke="white" strokeWidth="2.5" />
      <ellipse cx="55" cy="96" rx="18" ry="4" fill="white" opacity="0.3" />
      {/* Right pan */}
      <path d="M145 55L130 95h30z" fill="white" opacity="0.2" stroke="white" strokeWidth="2.5" />
      <ellipse cx="145" cy="96" rx="18" ry="4" fill="white" opacity="0.3" />
      {/* Top circle */}
      <circle cx="100" cy="30" r="8" fill="white" opacity="0.4" stroke="white" strokeWidth="2" />
    </g>
  ),
  'Direito Trabalhista': (
    <g>
      {/* Briefcase */}
      <rect x="50" y="60" width="100" height="70" rx="8" fill="white" opacity="0.15" stroke="white" strokeWidth="3" />
      <path d="M70 60V45a12 12 0 0 1 12-12h36a12 12 0 0 1 12 12v15" fill="none" stroke="white" strokeWidth="3" />
      <line x1="50" y1="85" x2="150" y2="85" stroke="white" strokeWidth="2.5" />
      <rect x="88" y="78" width="24" height="14" rx="4" fill="white" opacity="0.35" />
      {/* Gavel small */}
      <g transform="translate(78, 105) rotate(-30)">
        <rect x="0" y="0" width="28" height="8" rx="3" fill="white" opacity="0.3" />
        <rect x="10" y="-6" width="8" height="20" rx="2" fill="white" opacity="0.25" />
      </g>
    </g>
  ),
  'Direito de Família': (
    <g>
      {/* Heart shape */}
      <path
        d="M100 130C100 130 50 90 50 65a25 25 0 0 1 50-5 25 25 0 0 1 50 5c0 25-50 65-50 65z"
        fill="white"
        opacity="0.12"
        stroke="white"
        strokeWidth="3"
      />
      {/* Family figures */}
      {/* Adult left */}
      <circle cx="80" cy="72" r="8" fill="white" opacity="0.5" />
      <rect x="75" y="82" width="10" height="20" rx="4" fill="white" opacity="0.35" />
      {/* Adult right */}
      <circle cx="120" cy="72" r="8" fill="white" opacity="0.5" />
      <rect x="115" y="82" width="10" height="20" rx="4" fill="white" opacity="0.35" />
      {/* Child center */}
      <circle cx="100" cy="82" r="6" fill="white" opacity="0.5" />
      <rect x="96" y="90" width="8" height="14" rx="3" fill="white" opacity="0.35" />
    </g>
  ),
  'Direito Previdenciário': (
    <g>
      {/* Shield */}
      <path
        d="M100 30L55 55v30c0 30 18 48 45 60 27-12 45-30 45-60V55z"
        fill="white"
        opacity="0.1"
        stroke="white"
        strokeWidth="3"
      />
      {/* Checkmark inside */}
      <polyline
        points="78,82 93,98 125,64"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Decorative ring */}
      <circle cx="100" cy="80" r="38" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15" />
    </g>
  ),
  'Direito do Consumidor': (
    <g>
      {/* Shield with star */}
      <path
        d="M100 30L55 55v30c0 30 18 48 45 60 27-12 45-30 45-60V55z"
        fill="white"
        opacity="0.1"
        stroke="white"
        strokeWidth="3"
      />
      {/* Shopping bag inside shield */}
      <rect x="78" y="62" width="44" height="46" rx="4" fill="white" opacity="0.15" stroke="white" strokeWidth="2" />
      <path d="M86 62v-8a14 14 0 0 1 28 0v8" fill="none" stroke="white" strokeWidth="2.5" />
      {/* Star */}
      <polygon
        points="100,72 103,80 112,81 106,87 107,96 100,92 93,96 94,87 88,81 97,80"
        fill="white"
        opacity="0.4"
      />
    </g>
  ),
  'Direito Imobiliário': (
    <g>
      {/* Building / House */}
      <rect x="55" y="65" width="90" height="75" rx="4" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
      <path d="M45 70L100 30l55 40" fill="none" stroke="white" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Door */}
      <rect x="86" y="100" width="28" height="40" rx="3" fill="white" opacity="0.25" />
      <circle cx="108" cy="122" r="2.5" fill="white" opacity="0.5" />
      {/* Windows */}
      <rect x="64" y="76" width="20" height="16" rx="2" fill="white" opacity="0.2" />
      <rect x="116" y="76" width="20" height="16" rx="2" fill="white" opacity="0.2" />
      <line x1="74" y1="76" x2="74" y2="92" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="126" y1="76" x2="126" y2="92" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="64" y1="84" x2="84" y2="84" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="116" y1="84" x2="136" y2="84" stroke="white" strokeWidth="1" opacity="0.3" />
    </g>
  ),
};

// Color name to hex mapping
const colorHexMap: Record<string, string> = {
  'from-blue-500': '#3b82f6',
  'to-blue-700': '#1d4ed8',
  'from-emerald-500': '#10b981',
  'to-emerald-700': '#047857',
  'from-rose-500': '#f43f5e',
  'to-rose-700': '#be123c',
  'from-amber-500': '#f59e0b',
  'to-amber-700': '#b45309',
  'from-purple-500': '#a855f7',
  'to-purple-700': '#7e22ce',
  'from-cyan-500': '#06b6d4',
  'to-cyan-700': '#0e7490',
};

export default function AreaIllustration({
  areaName,
  colorFrom,
  colorTo,
  className = '',
}: AreaIllustrationProps) {
  const icon = areaIcons[areaName];
  const hexFrom = colorHexMap[colorFrom] || '#1e3a5f';
  const hexTo = colorHexMap[colorTo] || '#2563eb';
  const gradientId = `area-grad-${areaName.replace(/\s/g, '')}`;
  const patternId = `area-patt-${areaName.replace(/\s/g, '')}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label={areaName}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={hexFrom} />
            <stop offset="100%" stopColor={hexTo} />
          </linearGradient>
          <pattern id={patternId} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.8" fill="white" opacity="0.06" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="200" height="150" fill={`url(#${gradientId})`} rx="12" />
        <rect width="200" height="150" fill={`url(#${patternId})`} rx="12" />

        {/* Decorative shapes */}
        <circle cx="180" cy="20" r="40" fill="white" opacity="0.04" />
        <circle cx="15" cy="135" r="50" fill="white" opacity="0.03" />
        <circle cx="170" cy="130" r="25" fill="white" opacity="0.04" />

        {/* Bottom accent line */}
        <rect x="20" y="142" width="60" height="2" rx="1" fill="white" opacity="0.15" />

        {/* Icon */}
        {icon || (
          <circle cx="100" cy="75" r="30" fill="white" opacity="0.1" stroke="white" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}
