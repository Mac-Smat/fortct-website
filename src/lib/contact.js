export const FORTCT_WHATSAPP_NUMBER = '2347077875475'
export const FORTCT_WHATSAPP_DISPLAY = '0707 787 5475'
export const FORTCT_PHONE_HREF = `tel:+${FORTCT_WHATSAPP_NUMBER}`

/** Plain chat link — opens "Message FortCT Ltd on WhatsApp". */
export const FORTCT_WHATSAPP_LINK = `https://wa.me/${FORTCT_WHATSAPP_NUMBER}`

export function createWhatsAppLink(message) {
  const text = String(message ?? '').trim()
  return text
    ? `${FORTCT_WHATSAPP_LINK}?text=${encodeURIComponent(text)}`
    : FORTCT_WHATSAPP_LINK
}

/** Pre-filled enquiry text used by the product/service "Get a Quote" buttons. */
export function createWhatsAppQuoteMessage(serviceName) {
  const name = String(serviceName ?? '').trim() || 'your services'
  return `Hello FortCT! I'm interested in ${name}. Can you share pricing and options?`
}

/** Opens the FortCT WhatsApp Business chat in a new tab and returns the link used. */
export function openWhatsAppChat(message) {
  const url = createWhatsAppLink(message)
  window.open(url, '_blank', 'noopener,noreferrer')
  return url
}
