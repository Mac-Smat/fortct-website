export const FORTCT_WHATSAPP_NUMBER = '2347077875475'
export const FORTCT_WHATSAPP_DISPLAY = '0707 787 5475'
export const FORTCT_PHONE_HREF = `tel:+${FORTCT_WHATSAPP_NUMBER}`

export function createWhatsAppLink(message) {
  return `https://wa.me/${FORTCT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function createWhatsAppQuoteLink(serviceName) {
  const name = String(serviceName ?? '').trim() || 'your services'
  return createWhatsAppLink(
    `Hello FortCT! I'm interested in ${name}. Can you share pricing and options?`,
  )
}
