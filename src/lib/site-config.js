// Single source of truth for FortCT site metadata URLs.
// - ORIGIN: scheme + host only (no path). Set VITE_SITE_ORIGIN in production.
// - BASE_URL: Vite base path (e.g. '/fortct-website/' on GitHub Pages, '/' locally).
// Canonical/OG URLs are always ORIGIN + BASE_URL + path — never doubled.
export const SITE_NAME = 'FortCT Ltd'

export const ORIGIN = import.meta.env.VITE_SITE_ORIGIN ?? 'https://mac-smat.github.io'

export const BASE_URL = import.meta.env.BASE_URL ?? '/'

export function siteUrl(path = '') {
  return `${ORIGIN}${BASE_URL}${String(path).replace(/^\//, '')}`
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
  // Real social profile URLs — leave empty until verified; never render placeholder links.
  sameAs: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL ?? '',
    twitter: import.meta.env.VITE_TWITTER_URL ?? '',
    linkedin: import.meta.env.VITE_LINKEDIN_URL ?? '',
  },
  hasMap:
    'https://www.google.com/maps/search/?api=1&query=86+Ile-Pupa+Bus+Stop+Ibadan',
}

export const OG_IMAGE = `${ORIGIN}${BASE_URL}og-image.webp`
