import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { fetchGoogleReviews } from '../lib/google-reviews.js'
import moyinoluwaLaniyanAvatar from '../../assets/Testimonials Section Images/moyinoluwa-laniyan.webp'
import abassOlaiyaAvatar from '../../assets/Testimonials Section Images/abass-olaiya.webp'

// Google Business Profile link — used by the "See more reviews" button and as
// the Google attribution link while live reviews are not being fetched.
const GOOGLE_PROFILE_URL = 'https://g.page/r/CXzjsGLpIIVtEAE/review'

// Manually collected Google Business Profile reviews. They render whenever the
// google-reviews edge function returns no live data (the function is not
// deployed yet) and use the exact object shape that function returns, so
// adding another review is a single append here — the UI stays untouched.
const fallbackTestimonials = [
  {
    id: 'moyinoluwa-laniyan',
    author: 'Moyinoluwa Laniyan',
    quote:
      'It was a very fast service. My item branding consultation was done ASAP and delivery done within a short while.\n\nI highly recommend',
    rating: 5,
    role: 'Google Review',
    // Same ★/☆ string the google-reviews edge function builds from the rating.
    company: '★★★★★',
    date: null,
    relativeDate: '8 months ago',
    url: null,
    image: moyinoluwaLaniyanAvatar,
  },
  {
    id: 'abass-olaiya',
    author: 'ABASS OLAIYA',
    quote:
      'FortCT is truly exceptional. Their large-format printing is of outstanding quality, with sharp detail, vibrant colors, and a flawless finish every time. The team is professional, responsive, and genuinely committed to bringing ideas to life exactly as envisioned. From concept to final delivery, the process is smooth, efficient, and handled with great care. If you’re looking for a large-format printing firm that combines creativity, precision, and reliability, FortCT is an absolute standout.',
    rating: 5,
    role: 'Google Review',
    company: '★★★★★',
    date: null,
    relativeDate: '8 months ago',
    url: null,
    image: abassOlaiyaAvatar,
  },
]

// Google wordmark in official brand colors (attribution for Google review data).
function GoogleWordmark() {
  return (
    <span aria-hidden="true" className="text-sm font-semibold leading-none">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  )
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [reviews, setReviews] = useState(fallbackTestimonials)
  const [googleAttribution, setGoogleAttribution] = useState(GOOGLE_PROFILE_URL)

  useEffect(() => {
    let cancelled = false
    fetchGoogleReviews()
      .then(({ reviews: fetched, placeId, mapsUrl }) => {
        if (cancelled) return
        if (Array.isArray(fetched) && fetched.length > 0) {
          setActive((current) => (current >= fetched.length ? 0 : current))
          setReviews(fetched)
          setGoogleAttribution(
            mapsUrl ||
              (placeId
                ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
                : ''),
          )
        }
      })
      .catch(() => {
        // keep the fallback testimonials when the fetch fails
      })
    return () => {
      cancelled = true
    }
  }, [])

  const testimonials = reviews

  const handleChange = (index) => {
    if (index === active || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActive(index)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const handlePrev = () => {
    const newIndex = active === 0 ? testimonials.length - 1 : active - 1
    handleChange(newIndex)
  }

  const handleNext = () => {
    const newIndex = active === testimonials.length - 1 ? 0 : active + 1
    handleChange(newIndex)
  }

  const current = testimonials[active]

  return (
    <section id="testimonials" className="relative w-full bg-[#F9F9F9] overflow-hidden dark:bg-[#131316]">
      <h2 className="sr-only">Client Testimonials</h2>
      <div className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Large index number */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
          <span
            className="text-[72px] sm:text-[120px] font-light leading-none text-[#1A1C1C]/10 select-none transition-all duration-500 dark:text-[#F2F2F1]/10"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {String(active + 1).padStart(2, '0')}
          </span>

          <div className="flex-1 min-w-0 pt-2 sm:pt-6">
            {/* Quote */}
            <blockquote
              className={`text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-[#1A1C1C] tracking-tight transition-all duration-300 dark:text-[#F2F2F1] ${
                isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}
            >
              {current.quote}
            </blockquote>

            {/* Author info with hover reveal */}
            <div
              className={`mt-8 sm:mt-10 group cursor-default transition-all duration-300 delay-100 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#1A1C1C]/10 group-hover:ring-[#1A1C1C]/30 transition-all duration-300 dark:ring-[#F2F2F1]/10 dark:group-hover:ring-[#F2F2F1]/30 shrink-0">
                  {current.image ? (
                    <img
                      src={current.image}
                      alt={current.author}
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full flex items-center justify-center text-sm font-semibold text-[#1A1C1C] dark:text-[#F2F2F1] select-none"
                    >
                      {(current.author || '?').trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#1A1C1C] dark:text-[#F2F2F1]">
                    {current.url ? (
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={current.relativeDate}
                        className="font-medium text-[#1A1C1C] hover:underline underline-offset-4 dark:text-[#F2F2F1] dark:hover:underline"
                      >
                        {current.author}
                      </a>
                    ) : (
                      <span title={current.relativeDate}>{current.author}</span>
                    )}
                  </p>
                  <p className="flex flex-wrap items-center text-sm text-[#45483F] dark:text-[#A1A1AA]">
                    {current.role}
                    <span className="mx-2 text-[#1A1C1C]/20 dark:text-[#F2F2F1]/20">/</span>
                    <span className="group-hover:text-[#1A1C1C] transition-colors duration-300 dark:group-hover:text-[#F2F2F1]">
                      {current.company}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - vertical line selector */}
        <div className="mt-10 sm:mt-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleChange(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className="group relative py-4"
                >
                  <span
                    className={`block h-px transition-all duration-500 ease-out ${
                      index === active
                        ? 'w-12 bg-[#1A1C1C] dark:bg-[#F2F2F1]'
                        : 'w-6 bg-[#1A1C1C]/20 group-hover:w-8 group-hover:bg-[#1A1C1C]/40 dark:bg-[#F2F2F1]/20 dark:group-hover:bg-[#F2F2F1]/40'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-[#45483F] tracking-widest uppercase dark:text-[#A1A1AA]">
              {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2 rounded-full text-[#1A1C1C]/40 hover:text-[#1A1C1C] hover:bg-[#1A1C1C]/5 transition-all duration-300 dark:text-[#F2F2F1]/40 dark:hover:text-[#F2F2F1] dark:hover:bg-[#F2F2F1]/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2 rounded-full text-[#1A1C1C]/40 hover:text-[#1A1C1C] hover:bg-[#1A1C1C]/5 transition-all duration-300 dark:text-[#F2F2F1]/40 dark:hover:text-[#F2F2F1] dark:hover:bg-[#F2F2F1]/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* See more reviews button — opens the Google Business Profile in a new tab */}
        <div className="flex justify-center mt-12">
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See more reviews on Google"
          >
            <LiquidMetalButton
              variant="light"
              label="See more reviews"
              showArrow
              width={190}
            />
          </a>
        </div>

        {/* Google attribution (required when showing Google review data) */}
        {googleAttribution && (
          <div className="flex justify-center mt-6">
            <a
              href={googleAttribution}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#45483F] transition-colors hover:text-[#1A1C1C] dark:text-[#A1A1AA] dark:hover:text-[#F2F2F1]"
            >
              <GoogleWordmark />
              Reviews from Google
            </a>
          </div>
        )}
      </div>
    </section>
  )
}