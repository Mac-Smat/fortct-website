import { supabase } from './supabase.js'

const PUBLIC_ERROR_MESSAGE =
  'We could not load the services catalogue. Please check your connection and try again.'

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