import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Printer,
  Megaphone,
  PanelTop,
  Package,
  Shirt,
  Cake,
  BookOpen,
  Camera,
  Factory,
  Search,
  X,
} from 'lucide-react'
import { fetchPublishedCategories, fetchPublishedProducts, fetchProductImages } from '../lib/public-api.js'
import { formatPrice } from '../lib/format.js'
import { Tiles } from './Tiles.jsx'
import { Reveal } from './Reveal.jsx'
import { TextReveal } from './TextReveal.jsx'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import CtaBanner from './CtaBanner.jsx'

const BASE_URL = import.meta.env.BASE_URL
const CONTACT_PATH = `${BASE_URL}contact`

const CATEGORY_ICONS = {
  'Business Printing': Printer,
  'Marketing & Promotional': Megaphone,
  'Branding & Large Format': PanelTop,
  Packaging: Package,
  'Apparel & Merchandise': Shirt,
  'Event & Wedding': Cake,
  'Educational & Office': BookOpen,
  'Photo & Creative': Camera,
  'Industrial & Specialised': Factory,
}

function ProductPlaceholder({ Icon, name, className = '' }) {
  return (
    <div
      role="img"
      aria-label={`${name} — image coming soon`}
      className={`flex items-center justify-center bg-gradient-to-br from-[#E7E7E4] via-[#F6F6F4] to-[#D9D9D6] dark:from-[#26262B] dark:via-[#1E1E22] dark:to-[#17171B] ${className}`}
    >
      <Icon className="w-10 h-10 text-[#1A1C1C]/20 dark:text-white/20" strokeWidth={1.5} />
    </div>
  )
}

function ProductCard({ product, onViewDetails, onGetQuote }) {
  const Icon = CATEGORY_ICONS[product.category] ?? Package
  return (
    <article className="group flex flex-col bg-white dark:bg-[#1A1A1E] rounded-[24px] border border-[#C5C8BC]/50 dark:border-[#26262B] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_10px_36px_rgba(0,0,0,0.12)] dark:shadow-none">
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductPlaceholder Icon={Icon} name={product.name} className="w-full h-full" />
        )}
        <span className="absolute left-3 top-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1A1A1E]/90 backdrop-blur border border-[#C5C8BC]/40 dark:border-[#26262B] text-[11px] font-semibold tracking-[0.4px] text-[#3D4D2B] dark:text-[#AAB95F]">
          {product.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-[17px] font-semibold text-[#1A1C1C] leading-[24px] dark:text-[#F2F2F1]">
          {product.name}
        </h3>
        <p className="mt-3 text-[14px] font-bold text-[#1A1C1C] leading-[20px] dark:text-[#F2F2F1]">
          {product.price}
        </p>
        <div className="mt-auto pt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 h-[40px] rounded-[100px] border border-[#C5C8BC]/70 dark:border-[#26262B] text-[13px] font-semibold text-[#45483F] dark:text-[#A1A1AA] transition-colors duration-300 hover:border-[#3D4D2B] hover:text-[#3D4D2B] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F]"
          >
            View Details
          </button>
          <LiquidMetalButton
            variant="light"
            label="Get a Quote"
            width={132}
            height={40}
            onClick={() => onGetQuote(product)}
          />
        </div>
      </div>
    </article>
  )
}

function ServiceDetailModal({ product, onClose, onGetQuote }) {
  const closeRef = useRef(null)
  const modalRef = useRef(null)
  const Icon = product ? (CATEGORY_ICONS[product.category] ?? Package) : Package

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#1A1A1E] rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-[#1A1A1E]/90 backdrop-blur border border-[#C5C8BC]/40 dark:border-[#26262B] flex items-center justify-center text-[#45483F] dark:text-[#A1A1AA] hover:text-[#1A1C1C] dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative aspect-[4/3]">
          {product?.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ProductPlaceholder Icon={Icon} name={product?.name ?? ''} className="w-full h-full" />
          )}
          <span className="absolute left-3 bottom-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1A1A1E]/90 backdrop-blur border border-[#C5C8BC]/40 dark:border-[#26262B] text-[11px] font-semibold tracking-[0.4px] text-[#3D4D2B] dark:text-[#AAB95F]">
            {product?.category}
          </span>
        </div>

        <div className="p-6">
          <h3 id="service-detail-title" className="text-[22px] font-bold text-[#1A1C1C] leading-[30px] dark:text-[#F2F2F1]">
            {product?.name}
          </h3>
          <p className="mt-3 text-[16px] font-bold text-[#1A1C1C] leading-[22px] dark:text-[#F2F2F1]">
            {product?.price}
          </p>
          <p className="mt-4 text-[14px] font-normal leading-[22px] text-[#45483F] dark:text-[#A1A1AA]">
            Contact our team for specifications, quantities and delivery timelines.
          </p>
          <div className="mt-6 flex justify-center">
            <LiquidMetalButton
              variant="light"
              label="Get a Quote"
              showArrow
              width={170}
              onClick={() => onGetQuote(product)}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [detailProduct, setDetailProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const [categoryRows, productRows, imageRows] = await Promise.all([
        fetchPublishedCategories(),
        fetchPublishedProducts(),
        fetchProductImages(),
      ])
      const imageByProduct = {}
      for (const img of imageRows) {
        if (!imageByProduct[img.product_id]) imageByProduct[img.product_id] = img.image_url
      }
      const publishedCategories = new Set(categoryRows.map((c) => c.name))
      setCategories(categoryRows.map((c) => c.name))
      setServices(
        productRows
          .filter((p) => p.categories?.name && publishedCategories.has(p.categories.name))
          .map((p) => ({
            id: p.id,
            name: p.name,
            category: p.categories.name,
            price: formatPrice(p),
            image: imageByProduct[p.id],
            featured: p.featured,
            slug: p.slug,
          })),
      )
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return services.filter((s) => {
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query, services])

  const grouped = useMemo(() => {
    if (activeCategory !== 'All') {
      return filtered.length > 0 ? [[activeCategory, filtered]] : []
    }
    return categories
      .map((category) => [category, filtered.filter((s) => s.category === category)])
      .filter(([, items]) => items.length > 0)
  }, [activeCategory, filtered, categories])

  const totalCount = filtered.length

  const handleGetQuote = (product) => {
    setDetailProduct(null)
    const service = product?.category
    window.location.href = service
      ? `${CONTACT_PATH}?service=${encodeURIComponent(service)}`
      : CONTACT_PATH
  }

  return (
    <>
      {/* ============ SERVICES HERO ============ */}
      <section className="relative w-full max-w-[1280px] mx-auto px-4 pt-6 pb-14 md:pb-20 overflow-hidden">
        <div
          className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden opacity-20"
          aria-hidden="true"
        >
          <Tiles rows={30} tileSize="md" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center justify-center px-4 py-2.5 border border-black rounded-[20px] mb-6 dark:border-[#3A3A3E]">
              <span className="text-[14px] font-normal text-[#524848] leading-[17px] tracking-wide dark:text-[#A1A1AA]">
                OUR SERVICES
              </span>
            </div>
          </Reveal>

          <div className="relative w-full max-w-[980px] mx-auto px-4">
            <TextReveal
              as="h1"
              per="line"
              preset="fade-in-blur"
              className="text-[34px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-medium leading-[1.08] text-[#000000] tracking-normal uppercase dark:text-[#F2F2F1]"
            >
              {'Everything You Need to\nPrint, Brand & Build'}
            </TextReveal>
            <TextReveal
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-6 max-w-[700px] mx-auto text-[15px] sm:text-[18px] font-normal leading-[28px] text-[#323232]/80 uppercase dark:text-white/70"
            >
              PRINTING · BRANDING · LARGE FORMAT · PACKAGING · MERCHANDISE · EVENT &amp; OFFICE · CREATIVE — EXPLORE EVERYTHING FORTCT OFFERS WITH CLEAR PRICING.
            </TextReveal>
          </div>
        </div>
      </section>

      {/* ============ CATALOGUE ============ */}
      <section className="w-full bg-white dark:bg-[#0C0C0E]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-24" role="status">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E0EC38] opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#E0EC38]" />
              </span>
              <p className="mt-4 text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                Loading services...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-24">
              <p className="text-[16px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                Something went wrong
              </p>
              <p className="mt-2 text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                We could not load the services catalogue. Please check your connection and try again.
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

          {status === 'ready' && (
            <>
          {/* Search */}
          <Reveal className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#B7BBC4] dark:text-[#5C5C66] absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              <label htmlFor="services-search" className="sr-only">
                Search services
              </label>
              <input
                id="services-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full h-[48px] bg-[#F9F9F9] dark:bg-[#0F0F11] rounded-[12px] pl-10 pr-4 text-[14px] text-[#1A1C1C] dark:text-[#F2F2F1] placeholder:text-[#B7BBC4] dark:placeholder:text-[#5C5C66] outline-none focus:ring-2 ring-[#E0EC38]/60 transition-shadow border border-[#C5C8BC]/50 dark:border-[#26262B]"
              />
            </div>
          </Reveal>

          {/* Category filter pills */}
          <Reveal delay={80}>
            <div
              className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
              role="group"
              aria-label="Filter services by category"
            >
              {['All', ...categories].map((category) => {
                const active = activeCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={active}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-[0.3px] whitespace-nowrap border transition-colors duration-300 ${
                      active
                        ? 'bg-[#1A1C1C] border-[#1A1C1C] text-white dark:bg-[#F2F2F1] dark:border-[#F2F2F1] dark:text-[#1A1C1C]'
                        : 'border-[#C5C8BC]/60 text-[#45483F] hover:border-[#3D4D2B]/50 dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F]/50'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* Results summary */}
          <Reveal delay={120}>
            <p className="mt-6 text-[13px] font-normal text-[#45483F]/70 dark:text-[#A1A1AA]/70" role="status">
              {totalCount} {totalCount === 1 ? 'service' : 'services'}
              {query.trim() ? ` matching "${query.trim()}"` : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          </Reveal>

          {/* Category groups + grids */}
          {grouped.length === 0 ? (
            <Reveal delay={100}>
              <div className="flex flex-col items-center text-center py-16">
                <p className="text-[16px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                  No services found
                </p>
                <p className="mt-2 text-[14px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                  Nothing matches this search and category combination. Try a different term or clear the filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setActiveCategory('All')
                  }}
                  className="mt-6 px-5 py-2.5 rounded-full border border-[#C5C8BC]/60 text-[13px] font-semibold text-[#45483F] hover:border-[#3D4D2B] hover:text-[#3D4D2B] transition-colors dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F]"
                >
                  Clear filters
                </button>
              </div>
            </Reveal>
          ) : (
            grouped.map(([category, items], groupIndex) => (
              <div key={category} className="mt-12 first:mt-8">
                <Reveal delay={0}>
                  <div className="flex items-center gap-3">
                    <span className="h-[3px] w-8 bg-[#E0EC38]" aria-hidden="true" />
                    <h2 className="text-[20px] font-bold text-[#1A1C1C] leading-[28px] dark:text-[#F2F2F1]">
                      {category}
                    </h2>
                    <span className="text-[12px] font-semibold text-[#45483F]/60 dark:text-[#A1A1AA]/60">
                      {items.length}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={60 + groupIndex * 20}>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={setDetailProduct}
                        onGetQuote={handleGetQuote}
                      />
                    ))}
                  </div>
                </Reveal>
              </div>
            ))
          )}
            </>
          )}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <CtaBanner navigateTo={CONTACT_PATH} headingAs="h2" />

      <AnimatePresence>
        {detailProduct && (
          <ServiceDetailModal
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onGetQuote={handleGetQuote}
          />
        )}
      </AnimatePresence>
    </>
  )
}