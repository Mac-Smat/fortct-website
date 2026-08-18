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
      let message = null
      let subcode = null
      try {
        const err = await res.json()
        code = String(err?.error?.code ?? code)
        message = err?.error?.message ?? null
        subcode = err?.error?.error_subcode ?? null
        console.error(
          `submit-enquiry: meta send error template=${templateName} code=${code} subcode=${subcode ?? 'n/a'} message=${message ?? 'n/a'}`,
        )
      } catch {
        // non-JSON error body; keep http status code
      }
      return { sent: false, code, message, subcode }
    }
    return { sent: true, code: null, message: null, subcode: null }
  } catch {
    return { sent: false, code: 'network_error' }
  }
}

async function sendEmail(to, subject, html) {
  const apiKey = Deno.env.get('BREVO_API_KEY')
  const fromEmail = Deno.env.get('BREVO_FROM_EMAIL')
  if (!apiKey || !fromEmail || !to) {
    return { sent: false, code: 'not_configured' }
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: Deno.env.get('BREVO_FROM_NAME') ?? 'FortCT', email: fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    })
    if (!res.ok) {
      let code = `http_${res.status}`
      let message = null
      try {
        const err = await res.json()
        code = String(err?.code ?? code)
        message = err?.message ?? null
        console.error(
          `submit-enquiry: brevo send error to=${to} code=${code} message=${message ?? 'n/a'}`,
        )
      } catch {
        // non-JSON error body; keep http status code
      }
      return { sent: false, code, message }
    }
    return { sent: true, code: null, message: null }
  } catch {
    return { sent: false, code: 'network_error' }
  }
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEnquiryEmailHtml(details) {
  const rows = [
    ['Full name', details.fullName],
    ['WhatsApp number', details.whatsappNumber],
    ['Email', details.email || 'Not provided'],
    ['Service', details.serviceName || 'General Enquiry'],
    ['Message', details.message],
  ]
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;vertical-align:top;color:#5C5C66;font-size:14px;white-space:nowrap">${label}</td><td style="padding:8px 0;vertical-align:top;color:#1A1C1C;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#F5F5F2;padding:24px">
    <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden">
      <div style="background:#3D4D2B;padding:18px 24px;color:#FFFFFF;font-size:16px;font-weight:bold">New enquiry received</div>
      <div style="padding:24px">
        <table style="border-collapse:collapse;width:100%">${rowsHtml}</table>
      </div>
    </div>
  </div>`
}

function buildConfirmationEmailHtml(firstName) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#F5F5F2;padding:24px">
    <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden">
      <div style="background:#3D4D2B;padding:18px 24px;color:#FFFFFF;font-size:16px;font-weight:bold">We received your enquiry</div>
      <div style="padding:24px;color:#1A1C1C;font-size:14px;line-height:1.6">
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>Thank you for reaching out to FortCT. Your enquiry has been received and our team will get back to you within 24 hours.</p>
        <p>If you need immediate assistance, you can reach us on WhatsApp at 0707 787 5475.</p>
        <p>Best regards,<br/>The FortCT Team</p>
      </div>
    </div>
  </div>`
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

  const emailNotification = await sendEmail(
    Deno.env.get('BREVO_FORTCT_NOTIFY_EMAIL'),
    `New enquiry from ${fullName}`,
    buildEnquiryEmailHtml({
      fullName,
      whatsappNumber,
      email,
      serviceName: service?.name ?? serviceName,
      message,
    }),
  )
  if (!emailNotification.sent) {
    console.error(
      `submit-enquiry: email notification failed id=${enquiry.id} code=${emailNotification.code}`,
    )
  }

  let emailConfirmation = { sent: false, code: 'not_attempted' }
  const emailConfirmationEnabled =
    Deno.env.get('BREVO_CUSTOMER_CONFIRMATION_ENABLED') !== 'false'
  if (emailConfirmationEnabled && email) {
    emailConfirmation = await sendEmail(
      email,
      'We received your enquiry — FortCT',
      buildConfirmationEmailHtml(fullName.split(' ')[0] || fullName),
    )
    if (!emailConfirmation.sent) {
      console.error(
        `submit-enquiry: email confirmation failed id=${enquiry.id} code=${emailConfirmation.code}`,
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
      email_notification_status: emailNotification.sent
        ? 'sent'
        : emailNotification.code === 'not_configured'
          ? 'pending'
          : 'failed',
      email_customer_confirmation_status: emailConfirmation.sent
        ? 'sent'
        : emailConfirmation.code === 'not_configured' ||
            emailConfirmation.code === 'not_attempted'
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
      notification: notification.sent
        ? 'sent'
        : { code: notification.code, message: notification.message, subcode: notification.subcode },
      confirmation: confirmation.sent
        ? 'sent'
        : confirmation.code === 'not_attempted'
          ? 'not_attempted'
          : { code: confirmation.code, message: confirmation.message, subcode: confirmation.subcode },
    },
    email: {
      configured: Boolean(
        Deno.env.get('BREVO_API_KEY') && Deno.env.get('BREVO_FROM_EMAIL'),
      ),
      notification: emailNotification.sent
        ? 'sent'
        : emailNotification.code === 'not_attempted'
          ? 'not_attempted'
          : emailNotification.code,
      confirmation: emailConfirmation.sent
        ? 'sent'
        : emailConfirmation.code === 'not_attempted'
          ? 'not_attempted'
          : emailConfirmation.code,
    },
  })
})