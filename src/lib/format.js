export function formatNaira(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  return `₦${num.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export function formatPrice(product) {
  if (!product) return ''
  switch (product.pricing_type) {
    case 'fixed':
      return formatNaira(product.price)
    case 'starting_from':
      return `From ${formatNaira(product.price)}`
    case 'per_unit':
      return product.pricing_unit
        ? `${formatNaira(product.price)} / ${product.pricing_unit}`
        : formatNaira(product.price)
    case 'custom_quote':
    default:
      return 'Custom quote'
  }
}

export function slugify(text) {
  return String(text ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const PRICING_TYPES = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'starting_from', label: 'Starting from' },
  { value: 'per_unit', label: 'Per unit' },
  { value: 'custom_quote', label: 'Custom quote' },
]

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return 'No file selected'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPG, PNG and WebP images are allowed'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 5 MB or smaller'
  }
  return null
}