import { useEffect } from 'react'
import { FORTCT_WHATSAPP_NUMBER } from './contact.js'

export const SITE_URL = 'https://mac-smat.github.io'
const BASE_URL = import.meta.env.BASE_URL
const OG_IMAGE = `${SITE_URL}${BASE_URL}og-image.webp`
const SITE_NAME = 'FortCT Ltd'

const PAGE_META = {
  home: {
    title: 'FortCT Ltd — Premium Printing & Branding in Ibadan',
    description:
      'FortCT Ltd is a printing and branding company in Ibadan offering business cards, flyers, billboards, large format printing, packaging and creative design services.',
    path: '',
  },
  services: {
    title: 'Printing, Branding & Billboard Services | FortCT Ltd',
    description:
      'Explore the full FortCT catalogue — business printing, branding & large format, packaging, apparel, event, office and creative services with clear pricing.',
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
  name: 'FortCT Ltd',
  description:
    'FortCT Ltd is a printing and branding company in Ibadan offering printing, branding, billboard, large format, packaging and design services.',
  url: `${SITE_URL}${BASE_URL}`,
  telephone: `+${FORTCT_WHATSAPP_NUMBER}`,
  email: 'hello@fortct.ltd',
  image: OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '86, Ile-Pupa Bus Stop',
    addressLocality: 'Ibadan',
    addressCountry: 'NG',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
}

export function applyPageMeta(pathname) {
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
  const isPrivate = key === 'admin' || key === 'notfound'
  const url = meta.path === null ? null : `${SITE_URL}${BASE_URL}${meta.path}`

  document.title = meta.title

  if (meta.description) upsertMeta('name', 'description', meta.description)
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
  upsertMeta('property', 'og:title', meta.title)
  upsertMeta('property', 'og:description', meta.description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', OG_IMAGE)
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', meta.title)
  upsertMeta('name', 'twitter:description', meta.description)
  upsertMeta('name', 'twitter:image', OG_IMAGE)

  setJsonLd({ ...BUSINESS_JSONLD, url })
}

export function usePageMeta(pathname) {
  useEffect(() => {
    applyPageMeta(pathname)
  }, [pathname])
}
