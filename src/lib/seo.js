import { useEffect } from 'react'
import { ORIGIN, BASE_URL, SITE_NAME, OG_IMAGE, BUSINESS } from './site-config.js'
import { PAGE_META } from './page-meta.js'

export { PAGE_META }

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
  let script = document.getElementById(id)
  if (!obj) {
    script?.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(obj)
}

const BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${ORIGIN}${BASE_URL}#localbusiness`,
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

  setJsonLd(BUSINESS_JSONLD)
}

export function usePageMeta(pathname, seoSettings) {
  useEffect(() => {
    applyPageMeta(pathname, seoSettings)
  }, [pathname, seoSettings])
}
