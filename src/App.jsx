import { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import starIconSvg from './assets/icon-star.svg'
import galleryPhoto7 from '../assets/Gallery Section Images/gallery-photo-7.webp'
import imgGemini1 from './assets/img-gemini-1.png'
import imgGemini2 from './assets/img-gemini-2.png'
import watermarkImg from './assets/watermark.png'
import heroMainImage from '../assets/Hero Section Images/hero-main-image.webp'
import heroCardImage1 from '../assets/Hero Section Images/hero-card-image-1.webp'
import heroCardImage2 from '../assets/Hero Section Images/hero-card-image-2.webp'
import heroCardImage3 from '../assets/Hero Section Images/hero-card-image-3.webp'
import heroCardImage4 from '../assets/Hero Section Images/hero-card-image-4.webp'
import heroCardImage5 from '../assets/Hero Section Images/hero-card-image-5.webp'
import heroCardImage6 from '../assets/Hero Section Images/hero-card-image-6.webp'
import AboutSection from './components/AboutSection.jsx'
import GallerySection from './components/GallerySection.jsx'
import TestimonialsSection from './components/TestimonialsSection.jsx'
import ServiceSlider from './components/ServiceSlider.jsx'
import ContactSection from './components/ContactSection.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import HoverFooter from './components/HoverFooter.jsx'
import TiltCard from './components/TiltCard.jsx'
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
import { Tiles } from './components/Tiles.jsx'
import { usePageMeta } from './lib/seo.js'

const BASE_URL = import.meta.env.BASE_URL
const CONTACT_PATH = `${BASE_URL}contact`
const SERVICES_PATH = `${BASE_URL}services`
const CONTACT_ROUTE = '/contact'
const SERVICES_ROUTE = '/services'
const ABOUT_ROUTE = '/about'

const NAV_ITEMS = [
  { name: 'Home', link: `${BASE_URL}#home` },
  { name: 'Services', link: SERVICES_PATH },
  { name: 'Portfolio', link: `${BASE_URL}#portfolio` },
  { name: 'Contact', link: CONTACT_PATH },
]

const PAGE_NAV_ITEMS = [
  { name: 'Home', link: BASE_URL },
  { name: 'Services', link: SERVICES_PATH },
  { name: 'Portfolio', link: `${BASE_URL}#portfolio` },
  { name: 'Contact', link: CONTACT_PATH },
]

function usePathname() {
  return useLocation().pathname
}

// Progress bar removed â€” moved into AboutSection
const AdminArea = lazy(() => import('./admin/AdminArea.jsx'))
const ContactPage = lazy(() => import('./components/ContactPage.jsx'))
const ServicesPage = lazy(() => import('./components/ServicesPage.jsx'))
const AboutPage = lazy(() => import('./components/AboutPage.jsx'))
const SocialMediaHighlight = lazy(() => import('./components/SocialMediaHighlight.jsx'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage.jsx'))

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
  useEffect(() => {
    const prefetch = () => {
      import('./lib/public-api.js').then(({ prefetchCatalogue }) => prefetchCatalogue())
    }
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(prefetch, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(prefetch, 2000)
    return () => clearTimeout(id)
  }, [])
  const isContactPage = pathname === CONTACT_ROUTE
  const isServicesPage = pathname === SERVICES_ROUTE
  const isAboutPage = pathname === ABOUT_ROUTE
  const isUnknownPage = pathname !== '/' && !isContactPage && !isServicesPage && !isAboutPage
  const navItems = pathname === '/' ? NAV_ITEMS : PAGE_NAV_ITEMS
  const activeNavName = isContactPage
    ? 'Contact'
    : isServicesPage
      ? 'Services'
      : isAboutPage
        ? 'About'
        : undefined

  const handleQuoteClick = () => {
    if (isContactPage) {
      document
        .getElementById('contact-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (isServicesPage || isAboutPage || isUnknownPage) {
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
      ) : isAboutPage ? (
        <AboutPage />
      ) : isUnknownPage ? (
        <NotFoundPage />
      ) : (
        <>
      {/* ============ HERO SECTION (LOCKED) ============ */}
      <section className="relative w-full max-w-[1280px] mx-auto px-4 pt-6 pb-12 overflow-hidden md:overflow-visible">
        {/* Tiles background â€” full-bleed, ~20% opacity */}
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

      <AboutSection />

      {/* ============ SERVICES SECTION (HoverSlider template) ============ */}
      <ServiceSlider />

      {/* ============ SOCIAL MEDIA HIGHLIGHTS SECTION (replaces Why Choose Us bento) ============ */}
      <SocialMediaHighlight />

      {/* ============ GALLERY SECTION (21st animated gallery template) ============ */}
      <GallerySection />

      {/* ============ TESTIMONIALS SECTION ============ */}
      <TestimonialsSection />

      <ContactSection />
      <CtaBanner />
        </>
      )}
      <HoverFooter prefixLanding={isContactPage || isServicesPage || isAboutPage} />
    </div>
  )
}
