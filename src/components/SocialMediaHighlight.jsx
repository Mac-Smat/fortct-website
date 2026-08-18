import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
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

const MAX_TILES = 7

// Desktop bento per wireframe: top section = left square (42%) + two
// stacked center cards (28%) + tall right card (30%); bottom row = three
// equal cards (33% each). Tablet: feature spans full width, pairs of 2.
const TILE_SPANS = [
  'md:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-2 min-h-[320px] md:min-h-[380px] lg:min-h-[500px]',
  'lg:col-start-2 lg:row-start-1 min-h-[200px] md:min-h-[220px] lg:min-h-[248px]',
  'lg:col-start-2 lg:row-start-2 min-h-[200px] md:min-h-[220px] lg:min-h-[248px]',
  'lg:col-start-3 lg:row-start-1 lg:row-span-2 min-h-[200px] md:min-h-[220px] lg:min-h-[500px]',
  'lg:col-start-1 lg:row-start-3 min-h-[200px] md:min-h-[220px] lg:min-h-[220px]',
  'lg:col-start-2 lg:row-start-3 min-h-[200px] md:min-h-[220px] lg:min-h-[220px]',
  'lg:col-start-3 lg:row-start-3 min-h-[200px] md:min-h-[220px] lg:min-h-[220px]',
]

const STACK_CSS = `
  .social-stack [data-stack] {
    position: relative;
    z-index: 0;
    opacity: 1;
    transform: none;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  /* Tablet: 2-column grid + scroll-triggered reveal */
  @media (min-width: 768px) and (max-width: 1023px) {
    .social-stack [data-stack] {
      opacity: 0.55;
      transform: scale(0.975);
    }
    .social-stack [data-stack].is-active {
      opacity: 1;
      transform: scale(1);
      z-index: 5;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .social-stack [data-stack] {
      transition: none;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`

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

function useInViewport(ref, rootMargin = '100px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

// GIF-like playback: muted looping video, only while the card is on screen.
// Falls back to the static thumbnail when out of view or reduced motion.
// The observer watches a stable wrapper, not the swapped media element,
// so replacing img with video never fires a spurious "left viewport" event.
function GifVideo({ videoUrl, poster, className }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const inView = useInViewport(ref)

  return (
    <div ref={ref} className={className}>
      {videoUrl && inView && !reduceMotion ? (
        <video
          src={videoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}

function HighlightCard({ post, index }) {
  const platformName = post.platform === 'instagram' ? 'Instagram' : 'TikTok'
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platformName} post: ${post.caption}`}
      data-stack
      className={`group block overflow-hidden rounded-[24px] bg-[#F2F2F0] outline-none focus-visible:ring-2 focus-visible:ring-[#E0EC38] focus-visible:ring-offset-2 dark:bg-[#1A1A1E] ${TILE_SPANS[index % TILE_SPANS.length]}`}
    >
      {post.mediaUrl ? (
        <GifVideo
          videoUrl={post.videoUrl}
          poster={post.mediaUrl}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E7E7E4] dark:bg-[#26262B]">
          <span className="text-[13px] font-semibold text-[#45483F]/60 dark:text-[#A1A1AA]/60">
            {platformName}
          </span>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.3px] text-white backdrop-blur">
        {post.platform === 'instagram' ? <InstagramIcon className="h-3 w-3" /> : <TikTokIcon className="h-3 w-3" />}
        {platformName}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="line-clamp-2 text-[13px] font-semibold leading-[18px] text-white">
          {post.caption}
        </p>
        <p className="mt-1 text-[10px] font-medium tracking-[0.3px] text-white/70">
          {formatDate(post.timestamp)}
        </p>
      </div>
    </a>
  )
}

function SkeletonTile({ span }) {
  return (
    <div className={`animate-pulse rounded-[24px] bg-[#E7E7E4] dark:bg-[#1A1A1E] ${span}`} role="status" aria-label="Loading highlights" />
  )
}

function StickyStackCard({ post, index, progress, range, targetScale, reduceMotion }) {
  const scale = useTransform(progress, range, [1, targetScale])
  const platformName = post.platform === 'instagram' ? 'Instagram' : 'TikTok'
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platformName} post: ${post.caption}`}
      className="sticky top-0 flex items-center justify-center px-4 sm:px-6"
    >
      <motion.div
        style={{
          scale: reduceMotion ? 1 : scale,
          top: `calc(-5vh + ${index * 15 + 200}px)`,
        }}
        className="relative flex h-[200px] w-[280px] origin-top flex-col overflow-hidden rounded-[24px] bg-[#F2F2F0] sm:h-[240px] sm:w-[360px] dark:bg-[#1A1A1E]"
      >
        {post.mediaUrl ? (
          <GifVideo
            videoUrl={post.videoUrl}
            poster={post.mediaUrl}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#E7E7E4] dark:bg-[#26262B]">
            <span className="text-[13px] font-semibold text-[#45483F]/60 dark:text-[#A1A1AA]/60">
              {platformName}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.3px] text-white backdrop-blur">
          {post.platform === 'instagram' ? <InstagramIcon className="h-3 w-3" /> : <TikTokIcon className="h-3 w-3" />}
          {platformName}
        </span>
      </motion.div>
    </a>
  )
}

function MobileStickyStack({ posts }) {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const count = posts.length

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center pt-[5vh] pb-[50vh]"
    >
      {posts.map((post, index) => (
        <StickyStackCard
          key={post.id}
          post={post}
          index={index}
          progress={scrollYProgress}
          range={[index / count, 1]}
          targetScale={Math.max(0.6, 1 - (count - index - 1) * 0.08)}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  )
}

export default function SocialMediaHighlight() {
  const [status, setStatus] = useState('loading')
  const [posts, setPosts] = useState([])
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const gridRef = useRef(null)

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

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (event) => setIsMobile(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const highlights = useMemo(() => {
    return posts
      .filter((post) => matchesHighlights(post.caption))
      .sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''))
      .slice(0, MAX_TILES)
  }, [posts])

  useEffect(() => {
    if (status !== 'ready' || highlights.length === 0) return
    if (isMobile) return
    if (window.matchMedia('(min-width: 1024px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = gridRef.current?.querySelectorAll('[data-stack]')
    if (!cards?.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-active', entry.isIntersecting)
        }
      },
      { threshold: 0.35 },
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [status, highlights.length, isMobile])

  return (
    <section id="social-highlights" className="w-full bg-white pt-4 lg:pt-16 pb-10 lg:pb-16 dark:bg-[#0C0C0E]">
      <style>{STACK_CSS}</style>
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
            className="mt-6 lg:mt-8 text-[15px] sm:text-[16px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]"
          >
            Fresh projects and launches, straight from our socials.
          </RevealHeading>
        </Reveal>

        <Reveal className="mt-8 lg:mt-12">
          {status === 'loading' && (
            <div className="social-stack grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 lg:grid-cols-[42fr_28fr_30fr] lg:grid-rows-[250px_250px_220px] lg:gap-3">
              {TILE_SPANS.map((span, i) => (
                <SkeletonTile key={i} span={span} />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-20">
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
            <div className="flex flex-col items-center text-center py-20">
              <p className="text-[16px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                No highlights right now
              </p>
              <p className="mt-2 max-w-[420px] text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                Follow us on Instagram and TikTok to catch new projects, services and products as soon as they drop.
              </p>
            </div>
          )}

          {status === 'ready' && highlights.length > 0 && (
            isMobile ? (
              <MobileStickyStack posts={highlights} />
            ) : (
              <div
                ref={gridRef}
                className="social-stack grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 lg:grid-cols-[42fr_28fr_30fr] lg:grid-rows-[250px_250px_220px] lg:gap-3"
              >
                {highlights.map((post, index) => (
                  <HighlightCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )
          )}
        </Reveal>
      </div>
    </section>
  )
}
