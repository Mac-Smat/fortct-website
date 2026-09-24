const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Google Business Profile API v4.9 — official, free (no billing), OAuth only.
// Docs: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews
// Requires: verified listing + Google-approved API access + one-time OAuth
// consent (scope https://www.googleapis.com/auth/business.manage).
const GBP_BASE = 'https://mybusiness.googleapis.com/v4'
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const DEFAULT_BUSINESS_NAME = 'FortCT Ltd'
const CACHE_TTL_MS = 5 * 60 * 1000

// VS Code's built-in TypeScript service has no Deno global types (no
// tsconfig/deno.json in this workspace and the Deno extension may be off),
// which surfaces "Cannot find name 'Deno'" in the editor. This module-scoped
// declaration satisfies the editor only: it is erased at compile time and
// shadows — rather than conflicts with — the real Deno runtime globals when
// the file is checked with `deno check`.
declare const Deno: {
  env: {
    get(key: string): string | undefined
    set(key: string, value: string): void
    has(key: string): boolean
  }
  serve(handler: (req: Request) => Response | Promise<Response>): void
  [key: string]: any
}
export {}

// --- Shared types for GBP API payloads, mapped reviews, and caches ---

interface GbpAccount {
  name?: string
}

interface GbpLocation {
  name?: string
  locationName?: string
  isVerified?: boolean
}

interface GbpReviewer {
  displayName?: string
  profilePhotoUrl?: string
}

interface GbpReview {
  name?: string
  comment?: string
  createTime?: string
  starRating?: string | number
  reviewer?: GbpReviewer
}

interface ResolvedLocation {
  error: string | null
  accountId?: string
  locationId?: string
  locationName?: string | null
  mapsUrl?: string | null
}

interface MappedReview {
  id: string | null
  author: string
  quote: string
  rating: number | null
  role: string
  company: string | null
  date: string | null
  relativeDate: string | null
  url: null
  image: string | null
}

interface ReviewsResponse {
  configured: boolean
  error?: string
  name?: string | null
  rating?: number | null
  userRatingCount?: number | null
  mapsUrl?: string | null
  reviews: MappedReview[]
}

interface AccessTokenCache {
  token: string
  expiresAt: number
}

interface ResponseCache {
  at: number
  data: ReviewsResponse
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// --- OAuth: exchange the long-lived refresh token for a short-lived access token ---

let accessTokenCache: AccessTokenCache | null = null // { token, expiresAt }

async function getAccessToken() {
  const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
  const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
  if (!clientId || !clientSecret || !refreshToken) return null

  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt - 60_000) {
    return accessTokenCache.token
  }

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) {
    let message = null
    try {
      const err = await res.json()
      message = err?.error_description ?? err?.error ?? null
    } catch {
      // non-JSON error body — keep the http status code
    }
    console.error(
      `google-reviews: oauth http_${res.status} message=${message ?? 'n/a'}`,
    )
    return null
  }
  const data = await res.json()
  if (!data.access_token) return null
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  }
  return data.access_token
}

// --- Resolve the listing by business name (no Place ID needed) ---

async function resolveLocation(token: string): Promise<ResolvedLocation> {
  const auth = { Authorization: `Bearer ${token}` }

  const accountsRes = await fetch(`${GBP_BASE}/accounts`, { headers: auth })
  if (!accountsRes.ok) {
    console.error(`google-reviews: accounts http_${accountsRes.status}`)
    return { error: `accounts_http_${accountsRes.status}` }
  }
  const accounts: GbpAccount[] = (await accountsRes.json())?.accounts ?? []
  const accountId = accounts[0]?.name?.split('/')[1]
  if (!accountId) {
    console.error('google-reviews: no account found')
    return { error: 'no_account' }
  }

  const locationsRes = await fetch(
    `${GBP_BASE}/accounts/${accountId}/locations?pageSize=50`,
    { headers: auth },
  )
  if (!locationsRes.ok) {
    console.error(`google-reviews: locations http_${locationsRes.status}`)
    return { error: `locations_http_${locationsRes.status}` }
  }
  const locations: GbpLocation[] = (await locationsRes.json())?.locations ?? []
  const wanted = (
    Deno.env.get('GOOGLE_BUSINESS_NAME') || DEFAULT_BUSINESS_NAME
  ).toLowerCase()
  const matches = locations.filter((l) =>
    (l?.locationName ?? '').toLowerCase().includes(wanted),
  )
  const location =
    matches.length === 1
      ? matches[0]
      : matches.length > 1
        ? (matches.find((l) => l?.isVerified === true) ?? matches[0])
        : locations.length === 1
          ? locations[0]
          : null
  if (!location) {
    console.error('google-reviews: no matching location')
    return { error: 'no_location' }
  }
  const locationId = location.name?.split('/').pop()
  if (!locationId) return { error: 'no_location' }

  // Single-location GET for the mapsUri used in the Google attribution link.
  const metaRes = await fetch(
    `${GBP_BASE}/accounts/${accountId}/locations/${locationId}`,
    { headers: auth },
  )
  if (!metaRes.ok) {
    console.error(`google-reviews: location meta http_${metaRes.status}`)
    return { error: `location_http_${metaRes.status}` }
  }
  const meta = await metaRes.json()

  return {
    error: null,
    accountId,
    locationId,
    locationName: meta?.locationName ?? location.locationName ?? null,
    mapsUrl: meta?.metadata?.mapsUri ?? null,
  }
}

// --- Review mapping ---

const STAR_RATINGS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

function ratingNumber(value: unknown) {
  if (typeof value === 'number') return value >= 1 && value <= 5 ? value : null
  if (typeof value === 'string' && STAR_RATINGS[value]) return STAR_RATINGS[value]
  return null
}

function starRating(rating: number | null) {
  if (!rating || rating < 1 || rating > 5) return null
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function relativeDateFromIso(iso: string | null | undefined) {
  if (!iso) return null
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return null
  const minutes = Math.max(1, Math.floor((Date.now() - time) / 60_000))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  if (years >= 1) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months >= 1) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
}

function mapReview(review: GbpReview): MappedReview {
  const reviewer: GbpReviewer = review?.reviewer ?? {}
  const rating = ratingNumber(review?.starRating)
  const photoUrl =
    typeof reviewer.profilePhotoUrl === 'string' ? reviewer.profilePhotoUrl : ''
  return {
    id: review?.name ?? null,
    author: reviewer.displayName ?? 'Google User',
    quote: typeof review?.comment === 'string' ? review.comment : '',
    rating,
    role: 'Google Review',
    company: starRating(rating),
    date: review?.createTime ?? null,
    relativeDate: relativeDateFromIso(review?.createTime),
    // The GBP API exposes no per-review URL; attribution is carried by the
    // business mapsUri via the "Reviews from Google" wordmark link instead.
    url: null,
    // Only pass through directly-loadable profile photos; otherwise the
    // front-end falls back to a letter avatar.
    image: /^https:\/\//.test(photoUrl) ? photoUrl : null,
  }
}

async function fetchGoogleReviews(): Promise<ReviewsResponse> {
  const hasSecrets =
    Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') &&
    Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') &&
    Deno.env.get('GOOGLE_REFRESH_TOKEN')
  if (!hasSecrets) {
    return { configured: false, error: 'not_configured', reviews: [] }
  }
  try {
    const token = await getAccessToken()
    if (!token) return { configured: true, error: 'oauth_failed', reviews: [] }

    const location = await resolveLocation(token)
    if (location.error) {
      return { configured: true, error: location.error, reviews: [] }
    }

    const reviewsRes = await fetch(
      `${GBP_BASE}/accounts/${location.accountId}/locations/${location.locationId}/reviews?pageSize=5&orderBy=updateTime%20desc`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!reviewsRes.ok) {
      console.error(`google-reviews: reviews http_${reviewsRes.status}`)
      return {
        configured: true,
        error: `reviews_http_${reviewsRes.status}`,
        reviews: [],
      }
    }
    const payload = await reviewsRes.json()

    return {
      configured: true,
      name: location.locationName,
      rating: payload?.averageRating ?? null,
      userRatingCount: payload?.totalReviewCount ?? null,
      mapsUrl: location.mapsUrl,
      reviews: (payload?.reviews ?? []).map(mapReview),
    }
  } catch (err) {
    console.error('google-reviews: network error', err)
    return { configured: true, error: 'network_error', reviews: [] }
  }
}

// Only successful responses are cached so a transient Google outage does
// not poison the cache for the TTL window.
let cache: ResponseCache | null = null

Deno.serve(async (req: Request) => {
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