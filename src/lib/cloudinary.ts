// ============================================================
// Cloudinary — URLs públicas (sem SDK p/ funcionar em Client Components)
// ============================================================
// O SDK `cloudinary` usa `fs` e não roda no browser.
// Aqui usamos apenas strings de URL — zero dependência de Node.
// ============================================================
export const CLOUD_NAME = 'dwyrt2g1k'

// ============================================================
// URLs OTIMIZADAS — Transformações Cloudinary
// ============================================================
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

// Helpers de transformação
function cld(publicId: string, transforms: string = '') {
  const t = transforms ? `${transforms}/` : ''
  return `${BASE}/${t}${publicId}`
}

// ============================================================
// IMAGENS OTIMIZADAS DO ESCRITÓRIO
// ============================================================
export const CLOUDINARY_IMAGES = {
  // Foto dos sócios — otimizada para diferentes contextos
  teamPhoto: {
    // Homepage/Sobre: aspect 4:5, alta qualidade
    hero: cld('cerbelera-oliveira/team-photo', 'f_auto,q_auto:best,w_800,h_1000,c_fill,g_faces'),
    // Card/thumbnail
    thumb: cld('cerbelera-oliveira/team-photo', 'f_auto,q_auto,w_400,h_500,c_fill,g_faces'),
    // OG/Social share
    og: cld('cerbelera-oliveira/team-photo', 'f_jpg,q_85,w_1200,h_630,c_fill,g_faces'),
    // Quadrado (sobre)
    square: cld('cerbelera-oliveira/team-photo', 'f_auto,q_auto:best,w_800,h_800,c_fill,g_faces'),
    // Original otimizado
    full: cld('cerbelera-oliveira/team-photo', 'f_auto,q_auto:best'),
  },

  // Logotipo
  logo: {
    // Header (reduzido)
    header: cld('cerbelera-oliveira/logo-cover', 'f_auto,q_auto,w_200'),
    // Footer
    footer: cld('cerbelera-oliveira/logo-cover', 'f_auto,q_auto,w_300'),
    // Full
    full: cld('cerbelera-oliveira/logo-cover', 'f_auto,q_auto:best'),
    // Favicon circle
    icon: cld('cerbelera-oliveira/logo-cover', 'f_png,w_64,h_64,c_fill'),
  },

  // Profile photo
  profile: {
    small: cld('cerbelera-oliveira/profile-photo', 'f_auto,q_auto,w_100,h_100,c_fill'),
    medium: cld('cerbelera-oliveira/profile-photo', 'f_auto,q_auto,w_200'),
    full: cld('cerbelera-oliveira/profile-photo', 'f_auto,q_auto:best'),
  },

  // OG Image
  ogImage: cld('cerbelera-oliveira/og-image', 'f_jpg,q_85'),
} as const
