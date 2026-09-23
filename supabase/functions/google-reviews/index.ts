const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Read-only fetch of the business place; `reviews` returns the 5 most
// recent Google reviews for the place (capped by Google, not by us).
const FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews'
const CACHE_TTL_MS = 5 * 60 * 1000

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function starRating(rating) {
  const stars = Math.max(0, Math.min(5, Number(rating) || 0))
  return `${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`
}

function mapReview(review) {
  const author = review?.authorAttribution ?? {}
  const photoUri = typeof author.photoUri === 'string' ? author.photoUri : ''
  // Prefer the original language text, exactly as the reviewer wrote it.
  const quote =
    review?.originalText?.text ?? review?.text?.text ?? ''
  return {
    id: review?.name ?? null,
    author: author.displayName ?? 'Google User',
    quote,
    rating: review?.rating ?? null,
    role: 'Google Review',
    company: starRating(review?.rating),
    date: review?.publishTime ?? null,
    relativeDate: review?.relativePublishTimeDescription ?? null,
    // Only pass through directly-loadable profile photos; otherwise the
    // front-end falls back to a letter avatar.
    image: /^https:\/\//.test(photoUri) ? photoUri : null,
    // Reviewer profile link — required by Google's attribution policy.
    url: typeof author.uri === 'string' ? author.uri : null,
  }
}

async function fetchGoogleReviews() {
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
  const placeId = Deno.env.get('GOOGLE_PLACE_ID')
  if (!apiKey || !placeId) {
    return { configured: false, error: 'not_configured', reviews: [] }
  }
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
      },
    )
    if (!res.ok) {
      let message = null
      try {
        message = (await res.json())?.error?.message ?? null
      } catch {
        // non-JSON error body — keep the http status code
      }
      console.error(
        `google-reviews: places http_${res.status} message=${message ?? 'n/a'}`,
      )
      return { configured: true, error: `http_${res.status}`, reviews: [] }
    }
    const place = await res.json()
    return {
      configured: true,
      placeId,
      name: place?.displayName?.text ?? place?.displayName ?? null,
      rating: place?.rating ?? null,
      userRatingCount: place?.userRatingCount ?? null,
      reviews: (place?.reviews ?? []).map(mapReview),
    }
  } catch (err) {
    console.error('google-reviews: network error', err)
    return { configured: true, error: 'network_error', reviews: [] }
  }
}

// Only successful responses are cached so a transient Google outage does
// not poison the cache for the TTL window.
let cache = null

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405)
  }

  const now = Date.now()
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return json({ ok: true, ...cache.data })
  }

  const data = await fetchGoogleReviews()
  if (!data.error) cache = { at: now, data }
  return json({ ok: true, ...data })
})