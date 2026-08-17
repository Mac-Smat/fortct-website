import { useState, useRef, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import starIconSvg from './assets/icon-star.svg'
import galleryPhoto7 from '../assets/Gallery Section Images/gallery-photo-7.webp'
import imgGemini1 from './assets/img-gemini-1.png'
import imgGemini2 from './assets/img-gemini-2.png'
import watermarkImg from './assets/watermark.png'
import aboutMainImage1 from '../assets/About Us Section Images/about-main-image-1.webp'
import aboutMainImage2 from '../assets/About Us Section Images/about-main-image-2.webp'
import aboutBadge from '../assets/About Us Section Images/about-quality-badge.svg'
import serviceFormat from '../assets/Services Section Images/service-large-format.webp'
import heroMainImage from '../assets/Hero Section Images/hero-main-image.webp'
import heroCardImage1 from '../assets/Hero Section Images/hero-card-image-1.webp'
import heroCardImage2 from '../assets/Hero Section Images/hero-card-image-2.webp'
import heroCardImage3 from '../assets/Hero Section Images/hero-card-image-3.webp'
import heroCardImage4 from '../assets/Hero Section Images/hero-card-image-4.webp'
import heroCardImage5 from '../assets/Hero Section Images/hero-card-image-5.webp'
import heroCardImage6 from '../assets/Hero Section Images/hero-card-image-6.webp'
import GallerySection from './components/GallerySection.jsx'
import TestimonialsSection from './components/TestimonialsSection.jsx'
import ServiceSlider from './components/ServiceSlider.jsx'
import ContactSection from './components/ContactSection.jsx'
import ContactPage from './components/ContactPage.jsx'
import ServicesPage from './components/ServicesPage.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import HoverFooter from './components/HoverFooter.jsx'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from './components/ResizableNavbar.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { LiquidMetalButton } from './components/LiquidMetalButton.jsx'
import { Reveal } from './components/Reveal.jsx'
import { TextReveal } from './components/TextReveal.jsx'
import { RevealHeading } from './components/RevealHeading.jsx'
import { Tiles } from './components/Tiles.jsx'
import { useInView } from './hooks/useInView'
import { usePageMeta } from './lib/seo.js'

const BASE_URL = import.meta.env.BASE_URL
const CONTACT_PATH = `${BASE_URL}contact`
const SERVICES_PATH = `${BASE_URL}services`
const CONTACT_ROUTE = '/contact'
const SERVICES_ROUTE = '/services'

const NAV_ITEMS = [
  { name: 'Home', link: `${BASE_URL}#home` },
  { name: 'Services', link: SERVICES_PATH },
  { name: 'Portfolio', link: `${BASE_URL}#portfolio` },
  { name: 'Contact', link: CONTACT_PATH },
]

const CONTACT_NAV_ITEMS = [
  { name: 'Home', link: BASE_URL },
  { name: 'Services', link: SERVICES_PATH },
  { name: 'Portfolio', link: `${BASE_URL}#portfolio` },
  { name: 'Contact', link: CONTACT_PATH },
]

const SERVICES_NAV_ITEMS = [
  { name: 'Home', link: BASE_URL },
  { name: 'Services', link: SERVICES_PATH },
  { name: 'Portfolio', link: `${BASE_URL}#portfolio` },
  { name: 'Contact', link: CONTACT_PATH },
]

function usePathname() {
  return useLocation().pathname
}

// Reusable 3D Tilt Wrapper for Image/Content Boxes
function TiltCard({ children, className = '' }) {
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
  })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((centerY - y) / centerY) * 5
    const rotateY = ((x - centerX) / centerX) * 5
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.6s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </div>
  )
}

// Progress bar that fills from 0 to `value` when scrolled into view
function ProgressBar({ label, value }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-[12px] font-semibold tracking-[0.6px] text-[#1A1C1C] dark:text-[#F2F2F1]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-[8px] bg-[#E2E2E2] dark:bg-[#26262B] rounded-full relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#3D4D2B] dark:bg-[#AAB95F] rounded-full"
          style={{
            width: inView ? `${value}%` : '0%',
            transition: 'width 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-[#E0EC38] rounded-full shadow-md border-2 border-white" />
        </div>
      </div>
    </div>
  )
}

const AdminArea = lazy(() => import('./admin/AdminArea.jsx'))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] dark:bg-[#0C0C0E]" />
      }
    >
      <Routes>
        <Route path="/admin/*" element={<AdminArea />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </Suspense>
  )
}

function PublicSite() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  usePageMeta(pathname)
  const isContactPage = pathname === CONTACT_ROUTE
  const isServicesPage = pathname === SERVICES_ROUTE
  const navItems = isContactPage
    ? CONTACT_NAV_ITEMS
    : isServicesPage
      ? SERVICES_NAV_ITEMS
      : NAV_ITEMS
  const activeNavName = isContactPage ? 'Contact' : isServicesPage ? 'Services' : undefined

  const handleQuoteClick = () => {
    if (isContactPage) {
      document
        .getElementById('contact-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (isServicesPage) {
      window.location.href = CONTACT_PATH
      return
    }
    window.location.hash = '#quote'
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-[#E0EC38] selection:text-[#1B1D00] dark:bg-[#0C0C0E] dark:text-[#F2F2F1] transition-colors duration-300">
      {/* ============ TOP NAVIGATION BAR ============ */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} activeName={activeNavName} />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LiquidMetalButton
              variant="light"
              label="Get a Quote"
              onClick={handleQuoteClick}
            />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col items-center gap-4">
              <LiquidMetalButton
                variant="light"
                label="Get a Quote"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleQuoteClick()
                }}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

{isContactPage ? (
        <ContactPage />
      ) : isServicesPage ? (
        <ServicesPage />
      ) : (
        <>
      {/* ============ HERO SECTION (LOCKED) ============ */}
      <section className="relative w-full max-w-[1280px] mx-auto px-4 pt-6 pb-12 overflow-hidden md:overflow-visible">
        {/* Tiles background — full-bleed, ~20% opacity */}
        <div
          className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden opacity-20"
          aria-hidden="true"
        >
          <Tiles rows={30} tileSize="md" />
        </div>
        {/* Hero Content Block */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center justify-center px-4 py-2.5 border border-black rounded-[20px] mb-6 dark:border-[#3A3A3E]">
              <span className="text-[14px] font-normal text-[#524848] leading-[17px] tracking-wide dark:text-[#A1A1AA]">YOUR NO.1 QUALITY</span>
            </div>
          </Reveal>
          <div className="relative w-full max-w-[1021px] mx-auto px-4">
            <div className="hidden lg:block absolute left-[10px] top-[1px] w-[88px] h-[99px] pointer-events-none select-none">
              <img src={imgGemini1} alt="" className="w-full h-full object-contain animate-star-glow" />
            </div>
            <TextReveal
              as="h1"
              per="line"
              preset="fade-in-blur"
              className="text-[42px] sm:text-[60px] md:text-[76px] lg:text-[86px] font-medium leading-[1.08] text-[#000000] tracking-normal uppercase dark:text-[#F2F2F1]"
            >
              {'PREMIUM PRINTING \n& BRANDING.'}
            </TextReveal>
            <div className="hidden lg:block absolute right-[10px] bottom-[-20px] w-[88px] h-[99px] pointer-events-none select-none">
              <img src={imgGemini2} alt="" className="w-full h-full object-contain" />
            </div>
            <TextReveal
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-6 max-w-[656px] mx-auto text-[15px] sm:text-[18px] md:text-[20px] font-normal leading-[28px] text-[#323232]/80 uppercase dark:text-white/70"
            >
              WE COMBINE INDUSTRIAL PRINTING CAPABILITY WITH CREATIVE BRANDING EXPERTISE TO DELIVER PRECISION AND QUALITY FOR YOUR BUSINESS.
            </TextReveal>
          </div>
        </div>

        {/* Hero Collage & Rating */}
        <div className="relative z-10 mt-12 w-full max-w-[1280px] mx-auto">
          <div className="absolute left-[100px] lg:left-[133px] top-[-20px] sm:top-[0px] w-[110px] sm:w-[133px] h-[110px] sm:h-[134px] z-10 pointer-events-none select-none">
            <img src={watermarkImg} alt="Easily Customize" className="w-full h-full object-contain animate-spin-slow" />
          </div>

          <Reveal delay={160}>
            <div className="hidden md:flex items-start justify-center gap-3 lg:gap-4 min-h-[480px] lg:min-h-[540px] xl:min-h-[600px] pt-4">
            <div className="pt-[110px] lg:pt-[130px] xl:pt-[165px]">
              <TiltCard className="w-[130px] lg:w-[190px] xl:w-[250px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden shadow-md">
                <img src={galleryPhoto7} alt="" className="w-full h-full object-cover" />
              </TiltCard>
            </div>
            <div className="pt-[36px] lg:pt-[40px] xl:pt-[48px] flex flex-col gap-6">
              <TiltCard className="w-[96px] lg:w-[140px] xl:w-[186px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden">
                <img src={heroCardImage1} alt="" className="w-full h-full object-cover" />
              </TiltCard>
              <TiltCard className="w-[96px] lg:w-[140px] xl:w-[186px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden">
                <img src={heroCardImage2} alt="" className="w-full h-full object-cover" />
              </TiltCard>
            </div>
            <div className="pt-0">
              <TiltCard className="w-[190px] lg:w-[250px] xl:w-[330px] h-[430px] lg:h-[490px] xl:h-[600px] rounded-[10px] overflow-hidden shadow-lg">
                <img src={heroMainImage} alt="Premium printed business cards, brochures and branding materials by FortCT" className="w-full h-full object-cover" />
              </TiltCard>
            </div>
            <div className="pt-[36px] lg:pt-[40px] xl:pt-[48px] flex flex-col gap-6">
              <TiltCard className="w-[96px] lg:w-[140px] xl:w-[186px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden">
                <img src={heroCardImage3} alt="" className="w-full h-full object-cover" />
              </TiltCard>
              <TiltCard className="w-[96px] lg:w-[140px] xl:w-[186px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden">
                <img src={heroCardImage4} alt="" className="w-full h-full object-cover" />
              </TiltCard>
            </div>
            <div className="pt-[110px] lg:pt-[130px] xl:pt-[164px] flex flex-col gap-6">
              <TiltCard className="w-[130px] lg:w-[190px] xl:w-[250px] h-[160px] lg:h-[200px] xl:h-[220px] rounded-[10px] overflow-hidden">
                <img src={heroCardImage5} alt="" className="w-full h-full object-cover" />
              </TiltCard>
              <div className="pt-2 pl-2 flex flex-col gap-2">
                <p className="text-[14px] font-normal text-[#3D4D2B] leading-[20px] dark:text-[#AAB95F]">Rated 4.9/5 by 4,900+ clients</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIconSvg} alt="" className="w-[20px] h-[19px]" />
                  ))}
                </div>
              </div>
            </div>
            </div>
          </Reveal>

          <Reveal delay={240} className="md:hidden">
            <div className="flex flex-col items-center gap-6 pt-16">
              <TiltCard className="w-full max-w-[330px] h-[360px] rounded-[10px] overflow-hidden">
                <img src={heroMainImage} alt="Premium printed business cards, brochures and branding materials by FortCT" className="w-full h-full object-cover" />
              </TiltCard>
              <div className="grid grid-cols-2 gap-4 w-full max-w-[330px]">
                <TiltCard className="h-[160px] rounded-[10px] overflow-hidden">
                  <img src={galleryPhoto7} alt="" className="w-full h-full object-cover" />
                </TiltCard>
                <TiltCard className="h-[160px] rounded-[10px] overflow-hidden">
                  <img src={heroCardImage6} alt="" className="w-full h-full object-cover" />
                </TiltCard>
              </div>
              <div className="flex flex-col items-center text-center gap-2 pt-4">
                <p className="text-[14px] font-normal text-[#3D4D2B] leading-[20px] dark:text-[#AAB95F]">Rated 4.9/5 by 4,900+ clients</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIconSvg} alt="" className="w-[20px] h-[19px]" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ABOUT US SECTION (3:102) ============ */}
      <section className="relative w-full bg-[#F9F9F9] pt-14 pb-20 md:pt-20 md:pb-32 dark:bg-[#131316]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section Header (3:104) */}
           <Reveal className="flex flex-col items-center text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4">
              <svg className="w-[13px] h-[13px] text-[#3D4D2B] dark:text-[#AAB95F]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-[12px] font-semibold tracking-[1.2px] uppercase text-[#3D4D2B] dark:text-[#AAB95F]">ABOUT US</span>
            </div>
            <RevealHeading
              as="h2"
              per="line"
              preset="fade-in-blur"
              className="text-[32px] sm:text-[42px] md:text-[48px] font-bold leading-[40px] sm:leading-[56px] tracking-[-0.96px] text-[#1A1C1C] dark:text-[#F2F2F1]"
            >
              {'Precision Printing,\nTrusted Branding'}
            </RevealHeading>
          </Reveal>

          {/* Main 2-Column Grid (3:112) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column: Stacked Images with Circular Badge (3:113) */}
            <Reveal className="relative flex flex-col sm:flex-row gap-4 items-center justify-center">
              {/* Left Image (blueprints) */}
              <TiltCard className="w-full sm:w-[284px] h-[360px] sm:h-[500px] rounded-tl-[24px] rounded-tr-[100px] rounded-bl-[24px] rounded-br-[24px] overflow-hidden shadow-lg shrink-0">
                <img src={aboutMainImage1} alt="FortCT printing production workshop" className="w-full h-full object-cover" />
              </TiltCard>

              {/* Right Image (machinery) - offset down slightly for a staggered layout */}
              <TiltCard className="w-full sm:w-[284px] h-[360px] sm:h-[500px] rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] rounded-br-[100px] overflow-hidden shadow-lg shrink-0 sm:mt-12">
                <img src={aboutMainImage2} alt="FortCT large format printing equipment" className="w-full h-full object-cover" />
              </TiltCard>

              {/* Circular Badge - perfectly centered on the gap between images */}
              <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] rounded-full bg-[#3D4D2B] border-4 border-[#F9F9F9] dark:border-[#131316] shadow-2xl pointer-events-none select-none z-10">
                <img src={aboutBadge} alt="FortCT Quality" className="w-full h-full object-contain animate-spin-slow" />
              </div>
            </Reveal>

              {/* Right Column: Content & Progress Bars (3:171) */}
            <Reveal delay={120} className="flex flex-col gap-8">
              <p className="text-[18px] font-normal leading-[28px] text-[#45483F] dark:text-[#A1A1AA]">
                We help organizations unlock growth and efficiency through high-quality printed materials and cohesive brand identities. From business cards to large-scale outdoor advertising, we deliver excellence.
              </p>

              {/* Progress Bars Container (animate on scroll) */}
              <div className="flex flex-col gap-6">
                <ProgressBar label="Quality Assurance" value={98} />
                <ProgressBar label="On-Time Delivery" value={95} />
                <ProgressBar label="Client Satisfaction" value={100} />
              </div>

              {/* Learn More Button */}
              <Reveal delay={160}>
                <div>
                  <LiquidMetalButton
                    variant="light"
                    label="Learn More"
                    showArrow
                    onClick={() => {
                      window.location.hash = '#learn-more'
                    }}
                  />
                </div>
              </Reveal>
            </Reveal>
          </div>

          {/* ============ FLOATING UI FACT CARDS (3:24) ============ */}
          <Reveal className="relative z-20 mt-12 lg:mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Efficiency */}
              <Reveal delay={0}>
                <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-between h-[170px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">Efficiency</span>
                    <span className="px-2 py-1 bg-[#E0EC38] text-[#1A1C1C] text-[12px] font-bold rounded">90%</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Fast</span>
                    <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Reliable</span>
                    <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Quality</span>
                  </div>
                </TiltCard>
              </Reveal>

              {/* Card 2: Open 24 Hours */}
              <Reveal delay={80}>
                <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col items-start justify-center h-[170px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                  <div className="w-[48px] h-[48px] bg-[#E0EC38] rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-[#1A1C1C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="text-[18px] font-bold text-[#1A1C1C] leading-[22px] dark:text-[#F2F2F1]">Open 24</div>
                  <div className="text-[14px] font-normal text-[#C5C8BC] dark:text-[#6B6B73]">Hours</div>
                </TiltCard>
              </Reveal>

              {/* Card 3: Dark Card */}
              <Reveal delay={160}>
                <TiltCard className="bg-[#1A1C1C] border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-center h-[170px] dark:border-[#2E2E33]">
                  <p className="text-[18px] font-normal leading-[22.5px] text-[#E0EC38]">
                    Precision that Combines Strategy, Data, and Expert Printing
                  </p>
                </TiltCard>
              </Reveal>

              {/* Card 4: Print & Ship */}
              <Reveal delay={240}>
                <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-between h-[166px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                  <div className="flex justify-between items-center pb-3 border-b border-[#C5C8BC]/40 dark:border-[#26262B]">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#E0EC38]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">Print & Ship</span>
                    </div>
                    <span className="px-2 py-1 bg-[#E0EC38] text-[#1A1C1C] text-[12px] font-bold rounded">Fast</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <svg className="w-5 h-5 text-[#E0EC38]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">6 Categories</span>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </Reveal>

          {/* ============ STATS ROW (3:210) ============ */}
          <Reveal className="mt-14 pt-10 pb-10 lg:mt-20 lg:pt-12 lg:pb-12 border-t border-b border-[#C5C8BC] dark:border-[#26262B]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <Reveal delay={0}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">3k+</span>
                    <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                  </div>
                  <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Successful Projects</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">200+</span>
                    <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                  </div>
                  <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Expert Team</span>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">350+</span>
                    <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                  </div>
                  <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Happy Customers</span>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">16+</span>
                    <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                  </div>
                  <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Years of Experience</span>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES SECTION (HoverSlider template) ============ */}
      <ServiceSlider />

      {/* ============ WHY CHOOSE US / BENTO SECTION (3:323) ============ */}
      <section id="why-us" className="w-full bg-white pt-6 lg:pt-[80px] pb-16 md:pb-20 dark:bg-[#0C0C0E]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header (3:326) */}
          <Reveal className="max-w-[672px]">
            <RevealHeading
              as="h2"
              per="word"
              preset="fade-in-blur"
              className="text-[36px] sm:text-[48px] lg:text-[70px] font-bold text-[#1A1C1C] leading-[44px] sm:leading-[56px] tracking-[-0.96px] dark:text-[#F2F2F1]"
            >
              Why Choose us
            </RevealHeading>
            <RevealHeading
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-8 lg:mt-[40px] text-[15px] sm:text-[16px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]"
            >
              Expert team, proven strategies, personalized approach, and dedicated support to help your brand thrive and grow in the physical space.
            </RevealHeading>
          </Reveal>

          {/* Bento Grid (3:330) */}
          <Reveal className="mt-10 lg:mt-[72px]">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-[20px]">
              {/* 5.0 Rating (span 2x1) — 3:356 */}
              <Reveal delay={0} className="md:col-span-3 lg:col-span-2 h-[290px]">
                <TiltCard className="relative bg-[#E0EC38] rounded-[24px] p-6 w-full h-full flex flex-col justify-center overflow-hidden">
                  <div aria-hidden className="absolute -top-[56px] right-[62px] w-[192px] h-[192px] rounded-full border-[20px] border-[#1A1C1C]/10 pointer-events-none" />
                  <p className="font-[Plus Jakarta Sans] font-bold text-[44px] sm:text-[54px] lg:text-[60px] leading-[60px] text-[#1A1C1C] tracking-[-0.32px]">
                    5.0
                  </p>
                  <div className="mt-[18px] flex flex-col gap-[8px]">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src={starIconSvg} alt="" className="w-[20px] h-[19px]" />
                      ))}
                    </div>
                    <span className="text-[12px] font-semibold tracking-[0.6px] text-[#1A1C1C]/70">
                      CLIENT SATISFACTION RATING
                    </span>
                  </div>
                </TiltCard>
              </Reveal>

              {/* 100% Print & Ship — 3:331 */}
              <Reveal delay={70} className="h-[290px]">
                <TiltCard className="bg-[#1A1C1C] rounded-[24px] p-6 w-full h-full flex flex-col justify-between">
                  <p className="font-[Plus Jakarta Sans] font-bold text-[36px] leading-[40px] text-white">
                    100%
                  </p>
                  <span className="text-[12px] font-semibold tracking-[0.6px] text-white/60">
                    PRINT &amp; SHIP ACCURACY
                  </span>
                </TiltCard>
              </Reveal>

              {/* Our Dedicated Team (span 1x2) — 3:374 */}
              <Reveal delay={140} className="hidden lg:flex h-[600px] row-span-2">
                <TiltCard className="relative rounded-[24px] overflow-hidden w-full h-full bg-[#D9D9D9] dark:bg-[#1E1E22]">
                  <img src={serviceFormat} alt="Our Dedicated Team" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1A1C1C]/80 backdrop-blur-sm">
                    <span className="block px-6 py-5 text-[16px] font-medium leading-[24px] text-white">
                      Our Dedicated Team
                    </span>
                  </div>
                </TiltCard>
              </Reveal>

              {/* 24/7 — 3:338 */}
              <Reveal delay={210} className="h-[290px]">
                <TiltCard className="bg-[#1A1C1C] rounded-[24px] p-6 w-full h-full flex flex-col justify-between">
                  <p className="font-[Plus Jakarta Sans] font-bold text-[36px] leading-[40px] text-white">
                    24/7
                  </p>
                  <span className="text-[12px] font-semibold tracking-[0.6px] text-white/60">
                    PRODUCTION CYCLE
                  </span>
                </TiltCard>
              </Reveal>

              {/* Testimonial Quote — 3:345 */}
              <Reveal delay={280} className="h-[290px]">
                <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 w-full h-full flex flex-col justify-between dark:bg-[#1A1A1E] dark:border-[#26262B]">
                  <span className="text-[12px] font-semibold tracking-[0.6px] text-[#3D4D2B] dark:text-[#AAB95F]">
                    Building Lasting Success
                  </span>
                  <p className="text-[16px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]">
                    &ldquo;Your success is our mission &mdash; we don&rsquo;t just deliver prints, we build lasting brand partnerships.&rdquo;
                  </p>
                  <span className="text-[12px] font-semibold tracking-[0.6px] text-[#1A1C1C] dark:text-[#F2F2F1]">
                    Sarah Jenkins, CEO
                  </span>
                </TiltCard>
              </Reveal>

              {/* Lime Accent 3x — 3:379 */}
              <Reveal delay={350} className="h-[290px]">
                <TiltCard className="relative bg-[#E0EC38] rounded-[24px] p-6 w-full h-full flex flex-col justify-between overflow-hidden">
                  <p className="font-[Plus Jakarta Sans] font-bold text-[36px] leading-[40px] text-[#1B1D00]">
                    3x
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-[12px] font-semibold tracking-[0.6px] text-[#1B1D00]/70">
                      ENGAGEMENT GROWTH
                    </span>
                    <svg className="w-[54px] h-[40px] text-[#1B1D00]" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 46c10 4 34 8 30-8s-4-16-2-26c14-8 38-6 56 2 4 10-4 12-4 12s-6 2-6-6c-6 4-10 12-22 12-12 0-16-10-24-6 6 10 10 22 30 22 16 0 28-8 34-16" />
                    </svg>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ GALLERY SECTION (21st animated gallery template) ============ */}
      <GallerySection />

      {/* ============ TESTIMONIALS SECTION ============ */}
      <TestimonialsSection />

      <ContactSection />
      <CtaBanner />
        </>
      )}
      <HoverFooter prefixLanding={isContactPage || isServicesPage} />
    </div>
  )
}
