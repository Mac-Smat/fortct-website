import { supabase } from './supabase.js'

function messageFor(error, fallback) {
  const msg = error?.message ?? ''
  if (msg.includes('row-level security') || msg.includes('42501')) {
    return 'You are not authorized to perform this action'
  }
  return fallback
}

// ================= page-level SEO settings =================

export async function fetchSeoSettings() {
  const { data, error } = await supabase
    .from('seo_settings')
    .select('page_key, title, meta_description, og_image_url')
  if (error) throw new Error(messageFor(error, 'Could not load SEO settings'))
  return data ?? []
}

export async function upsertSeoSetting(pageKey, input) {
  const { data, error } = await supabase
    .from('seo_settings')
    .upsert(
      {
        page_key: pageKey,
        ...input,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_key' },
    )
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not save SEO setting'))
  return data
}

// ================= product-level SEO overrides =================

export async function fetchProductSeo(productId) {
  const { data, error } = await supabase
    .from('product_seo')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle()
  if (error) throw new Error(messageFor(error, 'Could not load product SEO'))
  return data
}

export async function upsertProductSeo(productId, input) {
  const { data, error } = await supabase
    .from('product_seo')
    .upsert(
      {
        product_id: productId,
        ...input,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'product_id' },
    )
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not save product SEO'))
  return data
}
