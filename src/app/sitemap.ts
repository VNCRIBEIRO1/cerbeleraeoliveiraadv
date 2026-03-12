import { MetadataRoute } from 'next';
import { articles, articleSEO } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cerbeleraeoliveiraadv.vercel.app';

  // Páginas estáticas — prioridades altas para páginas de conversão
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/areas-de-atuacao`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/agendamento`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/calculadora-de-direitos`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/politica-privacidade`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Páginas de blog — prioridade ALTA para rankear conteúdo
  const blogPages: MetadataRoute.Sitemap = Object.entries(articles).map(([slug]) => {
    const seo = articleSEO[slug];
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: seo?.modifiedTime ? new Date(seo.modifiedTime) : new Date('2026-03-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    };
  });

  return [...staticPages, ...blogPages];
}
