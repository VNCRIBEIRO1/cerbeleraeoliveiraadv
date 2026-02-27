'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import BlogIllustration from './illustrations/BlogIllustration';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  category: string;
  delay?: number;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  slug,
  category,
  delay = 0,
}: BlogCardProps) {
  return (
    <AnimatedSection delay={delay}>
      <Link href={`/blog/${slug}`} className="block group">
        <article className="card h-full border border-secondary-100 hover:border-gold-400/50 group-hover:-translate-y-1">
          {/* Illustration */}
          <BlogIllustration category={category} className="h-48" />

          <div className="p-6">
            <span className="inline-block text-xs font-medium text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full mb-3">
              {category}
            </span>

            <h3 className="text-lg font-serif font-bold text-primary-500 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-secondary-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gold-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}
