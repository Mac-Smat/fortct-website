import { supabase } from './supabase.js'

export function normalizeWhatsAppNumber(raw) {
  if (typeof raw !== 'string') return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234') && digits.length === 13) {
    return `+${digits}`
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+234${digits.slice(1)}`
  }
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`
  }
  return ''
}

export async function submitEnquiry(payload) {
  const { data, error } = await supabase.functions.invoke('submit-enquiry', {
    body: payload,
  })
  if (error) {
    const status = error.context?.status ?? null
    const message = error.context?.error ?? ''
    const err = new Error(
      status === 429
        ? 'Too many submissions. Please try again later.'
        : message || 'Could not submit your enquiry. Please try again.',
    )
    err.status = status
    throw err
  }
  if (!data?.ok) {
    const err = new Error(data?.error || 'Could not submit your enquiry. Please try again.')
    err.status = null
    throw err
  }
  return data
}
