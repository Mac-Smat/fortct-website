import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const GRAPH_API_VERSION =
  Deno.env.get('WHATSAPP_GRAPH_API_VERSION') ?? 'v23.0'

const NAME_MIN_LENGTH = 2
const MESSAGE_MIN_LENGTH = 10
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MINUTES = 5
const RATE_LIMIT_MAX_PER_WINDOW = 3

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function cleanNumber(raw) {
  if (typeof raw !== 'string') return null
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234') && digits.length === 13) {
    return `+${digits}`
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `+234${digits.slice(1)}`
  }
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`
  }
  return null
}

async function sendTemplate(supabase, to, templateName, parameters) {
  const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  if (!token || !phoneNumberId || !to) {
    return { sent: false, code: 'not_configured' }
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: parameters.map((text) => ({ type: 'text', text })),
              },
            ],
          },
        }),
      },
    )
    if (!res.ok) {
      let code = `http_${res.status}`
      try {
        const err = await res.json()
        code = String(err?.error?.code ?? code)
      } catch {
        // non-JSON error body; keep http status code
      }
      return { sent: false, code }
    }
    return { sent: true, code: null }
  } catch {
    return { sent: false, code: 'network_error' }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405)
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  if (!serviceRoleKey || !supabaseUrl) {
    console.error('submit-enquiry: service role credentials not configured')
    return json(
      { ok: false, error: 'Service temporarily unavailable' },
      500,
    )
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400)
  }

  if (typeof body.hp === 'string' && body.hp.length > 0) {
    return json({ ok: true, id: null, whatsapp: null })
  }

  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : ''
  const whatsappNumber = cleanNumber(body.whatsapp_number)
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const serviceName =
    typeof body.service_name === 'string' ? body.service_name.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const fieldErrors = {}
  if (fullName.length < NAME_MIN_LENGTH) {
    fieldErrors.full_name = 'Please enter your full name'
  }
  if (!whatsappNumber) {
    fieldErrors.whatsapp_number =
      'Please enter a valid WhatsApp number with country code (e.g. +2347077875475)'
  }
  if (email && !EMAIL_RE.test(email)) {
    fieldErrors.email = 'Please enter a valid email address'
  }
  if (serviceName && serviceName !== 'General Enquiry') {
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('status', 'published')
    const match = (categories ?? []).find((c) => c.name === serviceName)
    if (!match) {
      fieldErrors.service_name = 'Please select a valid service'
    } else {
      body._service = match
    }
  }
  if (message.length < MESSAGE_MIN_LENGTH) {
    fieldErrors.message = 'Message must be at least 10 characters'
  }
  if (Object.keys(fieldErrors).length > 0) {
    return json({ ok: false, errors: fieldErrors }, 400)
  }

  const { count } = await supabase
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('whatsapp_number', whatsappNumber)
    .gte(
      'created_at',
      new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString(),
    )
  if (count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return json(
      { ok: false, error: 'Too many submissions. Please try again later.' },
      429,
    )
  }

  const service = body._service ?? null
  const { data: enquiry, error: insertError } = await supabase
    .from('enquiries')
    .insert({
      full_name: fullName,
      whatsapp_number: whatsappNumber,
      email: email || null,
      service_id: service?.id ?? null,
      service_name_snapshot: service?.name ?? (serviceName || null),
      message,
      source: 'fortct-website',
    })
    .select('id')
    .single()
  if (insertError || !enquiry) {
    console.error('submit-enquiry: insert failed', insertError?.code ?? 'unknown')
    return json(
      { ok: false, error: 'Could not save your enquiry. Please try again.' },
      500,
    )
  }

  const notification = await sendTemplate(
    supabase,
    Deno.env.get('WHATSAPP_FORTCT_NUMBER'),
    Deno.env.get('WHATSAPP_NOTIFICATION_TEMPLATE') ??
      'fortct_new_enquiry_notification',
    [fullName, whatsappNumber, serviceName || 'General Enquiry', message],
  )
  if (!notification.sent) {
    console.error(
      `submit-enquiry: notification failed id=${enquiry.id} code=${notification.code}`,
    )
  }

  let confirmation = { sent: false, code: 'not_attempted' }
  const confirmationEnabled =
    Deno.env.get('WHATSAPP_CUSTOMER_CONFIRMATION_ENABLED') !== 'false'
  if (confirmationEnabled) {
    confirmation = await sendTemplate(
      supabase,
      whatsappNumber,
      Deno.env.get('WHATSAPP_CUSTOMER_CONFIRMATION_TEMPLATE') ??
        'fortct_enquiry_confirmation',
      [fullName.split(' ')[0], serviceName || 'General Enquiry'],
    )
    if (!confirmation.sent) {
      console.error(
        `submit-enquiry: confirmation failed id=${enquiry.id} code=${confirmation.code}`,
      )
    }
  }

  const { error: updateError } = await supabase
    .from('enquiries')
    .update({
      whatsapp_notification_status: notification.sent
        ? 'sent'
        : notification.code === 'not_configured'
          ? 'pending'
          : 'failed',
      whatsapp_customer_confirmation_status: confirmation.sent
        ? 'sent'
        : confirmation.code === 'not_configured' ||
            confirmation.code === 'not_attempted'
          ? 'not_attempted'
          : 'failed',
    })
    .eq('id', enquiry.id)
  if (updateError) {
    console.error(
      `submit-enquiry: status update failed id=${enquiry.id} code=${updateError.code ?? 'unknown'}`,
    )
  }

  return json({
    ok: true,
    id: enquiry.id,
    whatsapp: {
      configured: Boolean(
        Deno.env.get('WHATSAPP_ACCESS_TOKEN') &&
          Deno.env.get('WHATSAPP_PHONE_NUMBER_ID'),
      ),
      notification: notification.sent ? 'sent' : notification.code,
      confirmation: confirmation.sent
        ? 'sent'
        : confirmation.code === 'not_attempted'
          ? 'not_attempted'
          : confirmation.code,
    },
  })
})