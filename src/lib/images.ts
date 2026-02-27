// Mapeamento central de imagens
// Imagens do escritório e Unsplash (uso gratuito)

export const IMAGES = {
  // Foto dos sócios
  lawyer: '/images/cerbelera_oliveira_team_photo.webp',

  // Hero background - Estátua da Justiça
  hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80',

  // Escritório / ambiente profissional
  office:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',

  // Logotipo
  logo: '/images/cerbelera_oliveira_logo_cover.webp',
  logoAlt: '/images/cerbelera_oliveira_profile_photo.webp',
  logoMini: '/images/cerbelera_oliveira_logo_cover.webp',
} as const;

// Imagens por área de atuação (cada uma única, sem repetição)
export const AREA_IMAGES: Record<string, string> = {
  'Direito Trabalhista':
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  'Direito Criminal':
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
  'Direito Civil':
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  'Direito Empresarial':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  'Direito Administrativo':
    'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=800&q=80',
  'Cálculos Judiciais':
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
};

// Imagens por categoria de blog (reutiliza áreas + fallback para 'Direito' genérico)
export const BLOG_IMAGES: Record<string, string> = {
  ...AREA_IMAGES,
  'Direito Penal':
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
  Direito:
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
};

// Imagem padrão (fallback)
export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80';

// Helper
export function getCategoryImage(category: string): string {
  return BLOG_IMAGES[category] || AREA_IMAGES[category] || DEFAULT_IMAGE;
}
