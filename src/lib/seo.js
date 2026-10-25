import { useEffect } from 'react'
import { ORIGIN, BASE_URL, SITE_NAME, OG_IMAGE, BUSINESS } from './site-config.js'

export const PAGE_META = {
  home: {
    title: 'FortCT Ltd — Premium Printing & Branding in Ibadan, Nigeria',
    description:
      'FortCT Ltd is a printing and branding company in Ibadan, Oyo State, Nigeria offering business cards, flyers, billboards, large format printing, packaging and creative design services.',
    path: '',
  },
  services: {
    title: 'Printing, Branding & Billboard Services | FortCT Ltd Ibadan',
    description:
      'Explore the full FortCT catalogue — business printing, branding & large format, packaging, apparel, event, office and creative services with clear pricing in Ibadan, Nigeria.',
    path: 'services',
  },
  contact: {
    title: 'Contact FortCT Ltd — Printing & Branding Services in Ibadan',
    description:
      'Get in touch with FortCT Ltd in Ibadan for printing, branding, billboard and large format services. Call 0707 787 5475 or send us a message.',
    path: 'contact',
  },
  about: {
    title: 'About FortCT Ltd — Printing & Branding Experts in Ibadan',
    description:
      'Learn about FortCT Ltd, the printing and branding company in Ibadan behind premium business printing, large format and outdoor advertising services.',
    path: 'about',
  },
  notfound: {
    title: 'Page Not Found | FortCT Ltd',
    description: '',
    path: null,
    private: true,
  },
  admin: {
    title: 'Admin — FortCT Ltd',
    description: '',
    path: null,
    private: true,
  },
}

function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  if (content) el.setAttribute('content', content)
  else el.remove()
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  if (href) el.setAttribute('href', href)
  else el.remove()
}

function setJsonLd(obj) {
  const id = 'site-jsonld'
  document.getElementById(id)?.remove()
  if (!obj) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(obj)
  document.head.appendChild(script)
}

const BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  description: BUSINESS.description,
  url: `${ORIGIN}${BASE_URL}`,
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  image: OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.addressLocality,
    addressRegion: BUSINESS.address.addressRegion,
    addressCountry: BUSINESS.address.addressCountry,
  },
  sameAs: Object.values(BUSINESS.sameAs).filter(Boolean),
  hasMap: BUSINESS.hasMap,
}

export function applyPageMeta(pathname, seoSettings = []) {
  const key = pathname.startsWith('/admin')
    ? 'admin'
    : pathname === '/services'
      ? 'services'
      : pathname === '/contact'
        ? 'contact'
        : pathname === '/about'
          ? 'about'
          : pathname === '/'
            ? 'home'
            : 'notfound'
  const meta = PAGE_META[key]
  const setting = seoSettings.find((s) => s.page_key === key) ?? {}
  const title = setting.title ?? meta.title
  const description = setting.meta_description ?? meta.description
  const ogImage = setting.og_image_url ?? OG_IMAGE
  const isPrivate = key === 'admin' || key === 'notfound'
  const url = meta.path === null ? null : `${ORIGIN}${BASE_URL}${meta.path}`

  document.title = title

  if (description) upsertMeta('name', 'description', description)
  else document.head.querySelector('meta[name="description"]')?.remove()

  upsertMeta('name', 'robots', isPrivate ? 'noindex, nofollow' : 'index, follow')

  if (isPrivate) {
    setCanonical(null)
    for (const tag of [
      ['property', 'og:title'],
      ['property', 'og:description'],
      ['property', 'og:type'],
      ['property', 'og:url'],
      ['property', 'og:image'],
      ['property', 'og:site_name'],
      ['name', 'twitter:card'],
      ['name', 'twitter:title'],
      ['name', 'twitter:description'],
      ['name', 'twitter:image'],
    ]) upsertMeta(tag[0], tag[1], '')
    setJsonLd(null)
    return
  }

  setCanonical(url)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)

  setJsonLd({ ...BUSINESS_JSONLD, url })
}

export function usePageMeta(pathname, seoSettings) {
  useEffect(() => {
    applyPageMeta(pathname, seoSettings)
  }, [pathname, seoSettings])
}
