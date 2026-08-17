import { supabase } from './supabase.js'
import { slugify } from './format.js'

function messageFor(error, fallback) {
  const msg = error?.message ?? ''
  if (msg.includes('duplicate key value') || msg.includes('23505')) {
    return 'A record with that slug already exists'
  }
  if (msg.includes('foreign key') || msg.includes('23503')) {
    return 'This record is still used by other records'
  }
  if (msg.includes('row-level security') || msg.includes('42501')) {
    return 'You are not authorized to perform this action'
  }
  if (msg.includes('could not parse') || msg.includes('22P02')) {
    return 'One of the values you entered is not valid'
  }
  return fallback
}

// ================= categories =================

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(messageFor(error, 'Could not load categories'))
  return data ?? []
}

export async function createCategory(input) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: slugify(input.slug || input.name),
      description: input.description || null,
      status: input.status || 'published',
      sort_order: Number(input.sort_order) || 0,
    })
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not create category'))
  return data
}

export async function updateCategory(id, input) {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: slugify(input.slug || input.name),
      description: input.description || null,
      status: input.status || 'published',
      sort_order: Number(input.sort_order) || 0,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not update category'))
  return data
}

// ================= products =================

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug, status)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(messageFor(error, 'Could not load services'))
  return data ?? []
}

export async function fetchProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, status)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(messageFor(error, 'Could not load service'))
  return data
}

export async function createProduct(input) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      category_id: input.category_id,
      name: input.name,
      slug: slugify(input.slug || input.name),
      description: input.description || null,
      price: input.pricing_type === 'custom_quote' ? null : Number(input.price),
      pricing_type: input.pricing_type,
      pricing_unit:
        input.pricing_type === 'per_unit' && input.pricing_unit
          ? input.pricing_unit
          : null,
      status: input.status || 'published',
      featured: Boolean(input.featured),
      sort_order: Number(input.sort_order) || 0,
    })
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not create service'))
  return data
}

export async function updateProduct(id, input) {
  const { data, error } = await supabase
    .from('products')
    .update({
      category_id: input.category_id,
      name: input.name,
      slug: slugify(input.slug || input.name),
      description: input.description || null,
      price: input.pricing_type === 'custom_quote' ? null : Number(input.price),
      pricing_type: input.pricing_type,
      pricing_unit:
        input.pricing_type === 'per_unit' && input.pricing_unit
          ? input.pricing_unit
          : null,
      status: input.status || 'published',
      featured: Boolean(input.featured),
      sort_order: Number(input.sort_order) || 0,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not update service'))
  return data
}

export async function archiveProduct(id, archived) {
  const { data, error } = await supabase
    .from('products')
    .update({ status: archived ? 'hidden' : 'published' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not update service status'))
  return data
}

export async function setProductFeatured(id, featured) {
  const { data, error } = await supabase
    .from('products')
    .update({ featured })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not update featured state'))
  return data
}

export async function duplicateProduct(id) {
  const source = await fetchProduct(id)
  if (!source) throw new Error('Service not found')

  let name = `${source.name} (Copy)`
  let slug = `${source.slug}-copy`
  for (let attempt = 2; ; attempt += 1) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        category_id: source.category_id,
        name,
        slug,
        description: source.description,
        price: source.price,
        pricing_type: source.pricing_type,
        pricing_unit: source.pricing_unit,
        status: 'hidden',
        featured: false,
        sort_order: Number(source.sort_order) + 1,
      })
      .select()
      .single()
    if (!error) return data
    if (!messageFor(error, '').includes('already exists')) {
      throw new Error(messageFor(error, 'Could not duplicate service'))
    }
    name = `${source.name} (Copy ${attempt})`
    slug = `${source.slug}-copy-${attempt}`
  }
}

// ================= product images =================

const publicUrl = (path) =>
  `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/services/${path}`

export async function fetchPrimaryImages() {
  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .eq('is_primary', true)
  if (error) throw new Error(messageFor(error, 'Could not load images'))
  return data ?? []
}

export async function fetchProductImages(productId) {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw new Error(messageFor(error, 'Could not load images'))
  return data ?? []
}

export async function uploadProductImage(productId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${productId}/${Date.now()}-${safeName}`
  const { error: uploadError } = await supabase.storage
    .from('services')
    .upload(path, file, { upsert: false })
  if (uploadError) {
    throw new Error(messageFor(uploadError, 'Could not upload image'))
  }

  const existing = await fetchProductImages(productId)
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: publicUrl(path),
      alt_text: null,
      sort_order: existing.length,
      is_primary: existing.length === 0,
    })
    .select()
    .single()
  if (error) {
    await supabase.storage.from('services').remove([path])
    throw new Error(messageFor(error, 'Could not save image record'))
  }
  return data
}

export async function replaceProductImage(productId, oldImage, file) {
  await deleteProductImage(productId, oldImage)
  return uploadProductImage(productId, file)
}

export async function deleteProductImage(productId, image) {
  const objectPath = image.image_url.split('/services/')[1]
  if (objectPath) {
    const { error: removeError } = await supabase.storage
      .from('services')
      .remove([objectPath])
    if (removeError) {
      throw new Error(messageFor(removeError, 'Could not remove image file'))
    }
  }
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', image.id)
  if (error) throw new Error(messageFor(error, 'Could not remove image record'))
  return true
}

export async function setPrimaryImage(productId, imageId) {
  const { error: clearError } = await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId)
  if (clearError) throw new Error(messageFor(clearError, 'Could not update images'))

  const { data, error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not set primary image'))
  return data
}

export async function reorderProductImages(productId, orderedIds) {
  for (let i = 0; i < orderedIds.length; i += 1) {
    const { error } = await supabase
      .from('product_images')
      .update({ sort_order: i })
      .eq('id', orderedIds[i])
      .eq('product_id', productId)
    if (error) throw new Error(messageFor(error, 'Could not reorder images'))
  }
  return true
}

// ================= enquiries =================

export async function fetchEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(messageFor(error, 'Could not load enquiries'))
  return data ?? []
}

export async function updateEnquiryStatus(id, status) {
  const { data, error } = await supabase
    .from('enquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(messageFor(error, 'Could not update enquiry status'))
  return data
}