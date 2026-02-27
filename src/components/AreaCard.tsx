'use client';

import Link from 'next/link';
import {
  Briefcase,
  Users,
  Heart,
  Landmark,
  ShieldCheck,
  Building2,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Users,
  Heart,
  Landmark,
  ShieldCheck,
  Building2,
};

const colorMap: Record<string, string> = {
  Briefcase: 'from-blue-500 to-blue-600',
  Users: 'from-emerald-500 to-emerald-600',
  Heart: 'from-rose-500 to-rose-600',
  Landmark: 'from-amber-500 to-amber-600',
  ShieldCheck: 'from-purple-500 to-purple-600',
  Building2: 'from-cyan-500 to-cyan-600',
};

interface AreaCardProps {
  iconName: string;
  title: string;
  description: string;
  href?: string;
  delay?: number;
}

export default function AreaCard({
  iconName,
  title,
  description,
  href = '/areas-de-atuacao',
  delay = 0,
}: AreaCardProps) {
  const Icon = iconMap[iconName] || Briefcase;
  const gradient = colorMap[iconName] || 'from-primary-500 to-primary-600';

  return (
    <AnimatedSection delay={delay}>
      <Link href={href} className="block group">
        <div className="card p-0 h-full border border-secondary-100 hover:border-gold-400/50 group-hover:-translate-y-1 overflow-hidden">
          {/* Decorative header bar */}
          <div className={`h-2 bg-gradient-to-r ${gradient}`} />

          <div className="p-8">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-serif font-bold text-primary-500 mb-3">
              {title}
            </h3>
            <p className="text-secondary-600 text-sm leading-relaxed mb-4">
              {description}
            </p>
            <span className="inline-flex items-center text-sm font-medium text-gold-500 group-hover:text-gold-600 transition-colors">
              Saiba mais
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}
