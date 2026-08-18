import { supabase } from './supabase.js'

const PUBLIC_ERROR_MESSAGE =
  'We could not load the services catalogue. Please check your connection and try again.'

const CACHE_KEY = 'fortct:services-catalogue:v1'
const CACHE_TTL_MS = 15 * 60 * 1000

export function getCachedCatalogue() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { cachedAt, categories, products, images } = JSON.parse(raw)
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null
    return { categories, products, images }
  } catch {
    return null
  }
}

export function saveCatalogueCache(categories, products, images) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ cachedAt: Date.now(), categories, products, images }),
    )
  } catch {
    // storage unavailable or full — ignore, fetch still works
  }
}

export async function fetchPublishedCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, sort_order')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(PUBLIC_ERROR_MESSAGE)
  return data ?? []
}

export async function fetchPublishedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, pricing_type, pricing_unit, featured, sort_order, categories(name)')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(PUBLIC_ERROR_MESSAGE)
  return data ?? []
}

export async function fetchProductImages() {
  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url, is_primary')
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw new Error(PUBLIC_ERROR_MESSAGE)
  return data ?? []
}

export function optimizeImageUrl(url, width = 640) {
  if (!url) return url
  if (!/^https:\/\//.test(url)) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}width=${width}&quality=70`
}

export async function prefetchCatalogue() {
  try {
    const [categories, products, images] = await Promise.all([
      fetchPublishedCategories(),
      fetchPublishedProducts(),
      fetchProductImages(),
    ])
    saveCatalogueCache(categories, products, images)
    return { categories, products, images }
  } catch {
    return null
  }
}