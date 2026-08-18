import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { formatDate } from '../lib/format.js'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'

const INCLUDE_KEYWORDS = [
  'new project',
  'completed project',
  'new service',
  'updated service',
  'new product',
  'new services',
  'services for',
  'branding of',
  'branding for',
  'printing of',
  'business card for',
  'billboard',
  'new gear',
  'launching',
  'from idea',
  'from concept',
  'jotted ideas',
  'vehicle branding',
  'roll-up',
  'custom branded',
  'nylons for',
]

const EXCLUDE_KEYWORDS = ['happy new week', 'happy new month']

const MAX_TILES = 8

const TILE_SPANS = [
  'md:col-span-2 lg:col-span-6 lg:row-span-2 lg:min-h-[540px]',
  'lg:col-span-3 lg:min-h-[256px]',
  'lg:col-span-3 lg:min-h-[256px]',
  'lg:col-span-3 lg:min-h-[256px]',
  'lg:col-span-3 lg:min-h-[256px]',
  'lg:col-span-4 lg:min-h-[256px]',
  'lg:col-span-4 lg:min-h-[256px]',
  'lg:col-span-4 lg:min-h-[256px]',
]

function matchesHighlights(caption) {
  const text = String(caption ?? '').toLowerCase().trim()
  if (!text) return false
  if (EXCLUDE_KEYWORDS.some((keyword) => text.includes(keyword))) return false
  return INCLUDE_KEYWORDS.some((keyword) => text.includes(keyword))
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function HighlightCard({ post, index }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${post.platform === 'instagram' ? 'Instagram' : 'TikTok'} post: ${post.caption}`}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] bg-[#F2F2F0] dark:bg-[#1A1A1E] min-h-[220px] md:min-h-[240px] ${TILE_SPANS[index % TILE_SPANS.length]}`}
    >
      {post.mediaUrl ? (
        <img
          src={post.mediaUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E7E7E4] dark:bg-[#26262B]">
          <span className="text-[13px] font-semibold text-[#45483F]/60 dark:text-[#A1A1AA]/60">
            {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1C]/85 via-[#1A1C1C]/20 to-transparent" aria-hidden="true" />

      <div className="relative mt-auto flex w-full flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-[0.4px] text-white backdrop-blur">
            {post.platform === 'instagram' ? <InstagramIcon className="h-3 w-3" /> : <TikTokIcon className="h-3 w-3" />}
            {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
          </span>
          <span className="text-[11px] font-medium text-white/60">
            {formatDate(post.timestamp)}
          </span>
        </div>
        <p className="line-clamp-2 text-[14px] font-medium leading-[20px] text-white">
          {post.caption}
        </p>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#E0EC38] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Open post
          <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  )
}

function SkeletonTile({ span }) {
  return (
    <div className={`min-h-[220px] md:min-h-[240px] animate-pulse rounded-[24px] bg-[#E7E7E4] dark:bg-[#1A1A1E] ${span}`} role="status" aria-label="Loading highlights" />
  )
}

export default function SocialMediaHighlight() {
  const [status, setStatus] = useState('loading')
  const [posts, setPosts] = useState([])

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const { data, error } = await supabase.functions.invoke('social-highlights')
      if (error || !data?.ok) throw new Error('fetch failed')
      setPosts(data.posts ?? [])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const highlights = useMemo(() => {
    return posts
      .filter((post) => matchesHighlights(post.caption))
      .sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''))
      .slice(0, MAX_TILES)
  }, [posts])

  return (
    <section id="social-highlights" className="w-full bg-white pt-6 lg:pt-[80px] pb-16 md:pb-20 dark:bg-[#0C0C0E]">
      <div className="max-w-[1280px] mx-auto px-6">
        <Reveal className="max-w-[672px]">
          <RevealHeading
            as="h2"
            per="word"
            preset="fade-in-blur"
            className="text-[36px] sm:text-[48px] lg:text-[70px] font-bold text-[#1A1C1C] leading-[44px] sm:leading-[56px] tracking-[-0.96px] dark:text-[#F2F2F1]"
          >
            Social Media Highlights
          </RevealHeading>
          <RevealHeading
            as="p"
            per="word"
            preset="fade"
            speedReveal={1.4}
            className="mt-8 lg:mt-[40px] text-[15px] sm:text-[16px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]"
          >
            Fresh work, new projects and recently launched services — straight from our Instagram and TikTok.
          </RevealHeading>
        </Reveal>

        <Reveal className="mt-10 lg:mt-[72px]">
          {status === 'loading' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-[20px]">
              {TILE_SPANS.slice(0, 7).map((span, i) => (
                <SkeletonTile key={i} span={i === 0 ? 'md:col-span-2 lg:col-span-6 lg:row-span-2' : 'lg:col-span-3 lg:min-h-[256px]'} />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-24">
              <p className="text-[16px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                We could not load the social highlights
              </p>
              <p className="mt-2 text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={load}
                className="mt-6 px-5 py-2.5 rounded-full border border-[#C5C8BC]/60 text-[13px] font-semibold text-[#45483F] hover:border-[#3D4D2B] hover:text-[#3D4D2B] transition-colors dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F]"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && highlights.length === 0 && (
            <div className="flex flex-col items-center text-center py-24">
              <p className="text-[16px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                No highlights right now
              </p>
              <p className="mt-2 max-w-[420px] text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                Follow us on Instagram and TikTok to catch new projects, services and products as soon as they drop.
              </p>
            </div>
          )}

          {status === 'ready' && highlights.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-[20px]">
              {highlights.map((post, index) => (
                <HighlightCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
