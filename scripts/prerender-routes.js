import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { PAGE_META } from '../src/lib/page-meta.js'

const outputDir = resolve('dist')
const serverDir = resolve('.prerender-server')
const routes = ['home', 'services', 'about', 'contact'].map((key) => {
  const metadata = PAGE_META[key]
  const path = metadata.path ? `/${metadata.path}` : '/'
  return { ...metadata, path, file: metadata.path ? `${metadata.path}.html` : 'index.html' }
})

const origin = (process.env.VITE_SITE_ORIGIN || 'https://fortctltd.vercel.app').replace(/\/$/, '')
const base = process.env.BASE_URL || '/'
const basePath = `/${base.split('/').filter(Boolean).join('/')}`.replace(/^\/$/, '')
const canonicalUrl = (path) => `${origin}${basePath}${path === '/' ? '/' : path}`
const escapeHtml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function setHeadTag(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function setMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedName}["'][^>]*>`, 'i')
  return setHeadTag(
    html,
    pattern,
    `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(content)}" />`,
  )
}

function setCanonical(html, url) {
  return setHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
  )
}

function metadataFor(html, route) {
  const url = canonicalUrl(route.path)
  let result = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
  result = setMeta(result, 'name', 'description', route.description)
  result = setMeta(result, 'name', 'robots', 'index, follow')
  result = setMeta(result, 'property', 'og:type', 'website')
  result = setMeta(result, 'property', 'og:site_name', 'FortCT Ltd')
  result = setMeta(result, 'property', 'og:title', route.title)
  result = setMeta(result, 'property', 'og:description', route.description)
  result = setMeta(result, 'property', 'og:url', url)
  result = setMeta(result, 'property', 'og:image', `${origin}${basePath}/og-image.webp`)
  result = setMeta(result, 'name', 'twitter:card', 'summary_large_image')
  result = setMeta(result, 'name', 'twitter:title', route.title)
  result = setMeta(result, 'name', 'twitter:description', route.description)
  result = setMeta(result, 'name', 'twitter:image', `${origin}${basePath}/og-image.webp`)
  return setCanonical(result, url)
}

try {
  const template = await readFile(resolve(outputDir, 'index.html'), 'utf8')
  const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

  for (const route of routes) {
    const rendered = await render(route.path)
    const preloadLinks = [...rendered.matchAll(/<link rel="preload"[^>]*\/?\s*>/g)]
      .map(([tag]) => tag)
      .join('\n    ')
    const markup = rendered.replace(/<link rel="preload"[^>]*\/?\s*>/g, '')
    if (!markup.trim()) throw new Error(`Prerender output was empty for ${route.path}`)

    let html = metadataFor(template, route)
    if (preloadLinks) html = html.replace('</head>', `    ${preloadLinks}\n  </head>`)
    html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    if (!html.includes(`<div id="root">${markup}</div>`)) {
      throw new Error(`Could not inject prerendered markup for ${route.path}`)
    }

    await writeFile(resolve(outputDir, route.file), html)
    console.log(`Prerendered ${route.path} -> ${route.file}`)
  }
} finally {
  await rm(serverDir, { recursive: true, force: true })
}
