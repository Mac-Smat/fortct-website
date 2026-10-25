// Single source of truth for FortCT site metadata URLs.
// - ORIGIN: scheme + host only (no path). Set VITE_SITE_ORIGIN in production.
// - BASE_URL: Vite base path (e.g. '/' locally, '/fortct-website/' on a subpath).
// - Canonical/OG URLs are always ORIGIN + BASE_URL + path — never doubled.
export const SITE_NAME = 'FortCT Ltd'

export const ORIGIN = import.meta.env.VITE_SITE_ORIGIN ?? 'https://fortctltd.vercel.app'

export const BASE_URL = import.meta.env.BASE_URL ?? '/'

export function siteUrl(path = '') {
  return ORIGIN + BASE_URL + String(path).replace(/^\/+/, '')
}

// Verified business details only. Do not invent hours, reviews, ratings or awards.
export const BUSINESS = {
  name: 'FortCT Ltd',
  description:
    'FortCT Ltd is a printing and branding company in Ibadan offering printing, branding, billboard, large format, packaging and design services.',
  telephone: '+2347077875475',
  telephoneDisplay: '0707 787 5475',
  email: 'fortctltd@gmail.com',
  address: {
    streetAddress: '86, Ile-Pupa Bus Stop',
    addressLocality: 'Ibadan',
    addressRegion: 'Oyo State',
    addressCountry: 'NG',
  },
  // Real social profile URLs — verified profiles set as code fallbacks;
  // Vercel env vars (VITE_INSTAGRAM_URL, etc.) override these if set.
  sameAs: {
    instagram:
      import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/fortct.ltd/',
    tiktok: import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@fortct.ltd',
    google_business:
      import.meta.env.VITE_GOOGLE_BUSINESS_URL ?? 'https://share.google/GGEB6XflzVbwzo2nW',
    linkedin: import.meta.env.VITE_LINKEDIN_URL ?? '',
  },
  hasMap:
    'https://www.google.com/maps/search/?api=1&query=86+Ile-Pupa+Bus+Stop+Ibadan',
}

export const OG_IMAGE = ORIGIN + BASE_URL + 'og-image.webp'
export const CANARY_MARK = "CANARY-SEO-TRUTH-99"
