const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const MAX_RAW_POSTS_PER_PLATFORM = 30

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function fetchInstagramPosts() {
  const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
  if (!token) return { configured: false, posts: [] }
  try {
    const params = new URLSearchParams({
      fields:
        'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
      limit: String(MAX_RAW_POSTS_PER_PLATFORM),
      access_token: token,
    })
    const res = await fetch(`https://graph.instagram.com/me/media?${params}`)
    if (!res.ok) {
      console.error(`social-highlights: instagram http_${res.status}`)
      return { configured: true, posts: [] }
    }
    const payload = await res.json()
    const posts = (payload?.data ?? []).map((p) => ({
      id: `ig-${p.id}`,
      platform: 'instagram',
      caption: p.caption ?? '',
      mediaUrl:
        p.media_type === 'VIDEO'
          ? p.thumbnail_url ?? p.media_url
          : p.media_url,
      videoUrl:
        p.media_type === 'VIDEO' || p.media_type === 'REELS'
          ? p.media_url ?? null
          : null,
      permalink: p.permalink,
      timestamp: p.timestamp ?? null,
    }))
    return { configured: true, posts }
  } catch (err) {
    console.error('social-highlights: instagram network error', err)
    return { configured: true, posts: [] }
  }
}

async function fetchTikTokPosts() {
  const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY')
  const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET')
  const accessToken = Deno.env.get('TIKTOK_ACCESS_TOKEN')
  if (!clientKey || !clientSecret || !accessToken) {
    return { configured: false, posts: [] }
  }
  try {
    const params = new URLSearchParams({
      fields: 'id,create_time,cover_image_url,share_url,video_description',
      max_count: String(MAX_RAW_POSTS_PER_PLATFORM),
      ac: clientKey,
      secret: clientSecret,
      access_token: accessToken,
    })
    const res = await fetch(
      `https://open.tiktok.com/apis/v1.1/tts/display/list?${params}`,
    )
    if (!res.ok) {
      console.error(`social-highlights: tiktok http_${res.status}`)
      return { configured: true, posts: [] }
    }
    const payload = await res.json()
    const videos = payload?.data?.videos ?? []
    const posts = videos.map((v) => ({
      id: `tt-${v.id}`,
      platform: 'tiktok',
      caption: v.video_description ?? '',
      mediaUrl: v.cover_image_url,
      permalink: v.share_url,
      timestamp: v.create_time
        ? new Date(v.create_time * 1000).toISOString()
        : null,
    }))
    return { configured: true, posts }
  } catch (err) {
    console.error('social-highlights: tiktok network error', err)
    return { configured: true, posts: [] }
  }
}

let cache = null
const CACHE_TTL_MS = 5 * 60 * 1000

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

  const [instagram, tiktok] = await Promise.all([
    fetchInstagramPosts(),
    fetchTikTokPosts(),
  ])
  const data = {
    posts: [...instagram.posts, ...tiktok.posts],
    configured: { instagram: instagram.configured, tiktok: tiktok.configured },
  }
  cache = { at: now, data }
  return json({ ok: true, ...data })
})
